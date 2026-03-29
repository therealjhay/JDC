from rest_framework import serializers
from .models import Category, Brand, Product, Variant, ProductImage


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'created_at']
        read_only_fields = ['id', 'created_at']


class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ['id', 'name', 'slug', 'created_at']
        read_only_fields = ['id', 'created_at']


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'product', 'variant', 'image_url', 'public_id', 'is_primary', 'created_at']
        read_only_fields = ['id', 'created_at']


class VariantSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)

    class Meta:
        model = Variant
        fields = ['id', 'product', 'color', 'strap_type', 'size', 'price', 'stock', 'sku', 'created_at', 'images']
        read_only_fields = ['id', 'created_at']


class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    variants = VariantSerializer(many=True, read_only=True)
    brand_detail = BrandSerializer(source='brand', read_only=True)
    category_detail = CategorySerializer(source='category', read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'description', 'brand', 'brand_detail',
            'category', 'category_detail', 'base_price', 'is_active',
            'created_at', 'updated_at', 'images', 'variants',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
