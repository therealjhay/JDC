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
    items_payload = serializers.ListField(
        child=serializers.DictField(),
        write_only=True,
        required=False,
    )

    class Meta:
        model = Order
        fields = ['id', 'customer_name', 'phone', 'status', 'created_at', 'items', 'items_payload']
        read_only_fields = ['id', 'created_at']

    def create(self, validated_data):
        items_payload = validated_data.pop('items_payload', [])
        order = Order.objects.create(**validated_data)
        for item in items_payload:
            OrderItem.objects.create(
                order=order,
                product_id=item.get('product'),
                variant_id=item.get('variant'),
                quantity=item.get('quantity', 1),
                price=item.get('price', 0),
            )
        return order
