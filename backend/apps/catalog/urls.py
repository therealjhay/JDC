from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, BrandViewSet, ProductViewSet, VariantViewSet, ProductImageViewSet

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'brands', BrandViewSet, basename='brand')
router.register(r'variants', VariantViewSet, basename='variant')
router.register(r'images', ProductImageViewSet, basename='productimage')

urlpatterns = router.urls
