import cloudinary
import cloudinary.uploader
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Category, Brand, Product, Variant, ProductImage
from .serializers import (
    CategorySerializer, BrandSerializer, ProductSerializer,
    VariantSerializer, ProductImageSerializer,
)
from .filters import ProductFilter


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class BrandViewSet(viewsets.ModelViewSet):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.select_related('brand', 'category').prefetch_related('images', 'variants').all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filterset_class = ProductFilter
    search_fields = ['name', 'description']
    ordering_fields = ['base_price', 'created_at']
    ordering = ['-created_at']


class VariantViewSet(viewsets.ModelViewSet):
    queryset = Variant.objects.select_related('product').prefetch_related('images').all()
    serializer_class = VariantSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


ALLOWED_IMAGE_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.webp'}
ALLOWED_IMAGE_CONTENT_TYPES = {'image/jpeg', 'image/png', 'image/webp'}


def _is_valid_image(file):
    name = (file.name or '').lower()
    ext = '.' + name.split('.')[-1] if '.' in name else ''
    if ext not in ALLOWED_IMAGE_EXTENSIONS:
        return False
    content_type = getattr(file, 'content_type', '')
    if content_type and content_type not in ALLOWED_IMAGE_CONTENT_TYPES:
        return False
    return True


def _parse_bool(value):
    if isinstance(value, bool):
        return value
    if value is None:
        return False
    return str(value).lower() in ('1', 'true', 't', 'yes', 'y', 'on')


class ProductImageViewSet(viewsets.ModelViewSet):
    queryset = ProductImage.objects.select_related('product', 'variant').all()
    serializer_class = ProductImageSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    @action(detail=False, methods=['post'], parser_classes=[MultiPartParser, FormParser], permission_classes=[IsAuthenticated])
    def upload(self, request):
        files = []
        if 'images' in request.FILES:
            files.extend(request.FILES.getlist('images'))
        if 'image' in request.FILES:
            files.append(request.FILES.get('image'))

        product_id = request.data.get('product')
        variant_id = request.data.get('variant')
        is_primary = _parse_bool(request.data.get('is_primary', False))
        primary_index = request.data.get('primary_index')

        if not files:
            return Response({'error': 'No image file provided.'}, status=status.HTTP_400_BAD_REQUEST)
        if not product_id:
            return Response({'error': 'product field is required.'}, status=status.HTTP_400_BAD_REQUEST)

        if primary_index is not None:
            try:
                primary_index = int(primary_index)
            except (TypeError, ValueError):
                primary_index = None

        created = []
        for idx, file in enumerate(files):
            if not file or not _is_valid_image(file):
                return Response({'error': 'Invalid file type. Allowed: jpg, jpeg, png, webp.'}, status=status.HTTP_400_BAD_REQUEST)
            try:
                result = cloudinary.uploader.upload(file, folder='jdc/products')
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            image_data = {
                'product': product_id,
                'variant': variant_id,
                'image_url': result.get('secure_url'),
                'public_id': result.get('public_id'),
                'is_primary': is_primary if len(files) == 1 else (primary_index == idx),
            }
            serializer = ProductImageSerializer(data=image_data)
            if serializer.is_valid():
                serializer.save()
                created.append(serializer.data)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        if len(created) == 1:
            return Response(created[0], status=status.HTTP_201_CREATED)
        return Response({'results': created}, status=status.HTTP_201_CREATED)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.public_id:
            try:
                cloudinary.uploader.destroy(instance.public_id)
            except Exception:
                pass
        return super().destroy(request, *args, **kwargs)


class ImageUploadView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        file = request.FILES.get('image')
        if not file:
            return Response({'error': 'No image file provided.'}, status=status.HTTP_400_BAD_REQUEST)
        if not _is_valid_image(file):
            return Response({'error': 'Invalid file type. Allowed: jpg, jpeg, png, webp.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            result = cloudinary.uploader.upload(file, folder='jdc/uploads')
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({
            'url': result.get('secure_url'),
            'public_id': result.get('public_id'),
        }, status=status.HTTP_201_CREATED)
