from django.contrib import admin
from .models import Category, Brand, Product, Variant, ProductImage


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'created_at']
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ['name']


@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'created_at']
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ['name']


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'brand', 'category', 'base_price', 'is_active', 'created_at']
    list_filter = ['is_active', 'brand', 'category']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Variant)
class VariantAdmin(admin.ModelAdmin):
    list_display = ['product', 'sku', 'color', 'strap_type', 'size', 'price', 'stock']
    search_fields = ['sku', 'product__name']
    list_filter = ['product']


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ['product', 'variant', 'is_primary', 'created_at']
    list_filter = ['is_primary']
