from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.catalog.views import CategoryViewSet, BrandViewSet, ProductViewSet, VariantViewSet, ProductImageViewSet, ImageUploadView
from apps.orders.views import OrderViewSet
from apps.authentication.views import LoginView, LogoutView, MeView

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'brands', BrandViewSet, basename='brand')
router.register(r'variants', VariantViewSet, basename='variant')
router.register(r'images', ProductImageViewSet, basename='productimage')
router.register(r'orders', OrderViewSet, basename='order')

urlpatterns = [
    path('', include(router.urls)),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('me/', MeView.as_view(), name='me'),
    path('upload/', ImageUploadView.as_view(), name='image-upload'),
]
