from rest_framework import serializers
from .models import Order, OrderItem
from apps.catalog.serializers import ProductSerializer, VariantSerializer


class OrderItemSerializer(serializers.ModelSerializer):
    product_detail = ProductSerializer(source='product', read_only=True)
    variant_detail = VariantSerializer(source='variant', read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'order', 'product', 'product_detail', 'variant', 'variant_detail', 'quantity', 'price']
        read_only_fields = ['id']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'customer_name', 'phone', 'status', 'created_at', 'items']
        read_only_fields = ['id', 'created_at']
