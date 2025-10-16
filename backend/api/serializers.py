from rest_framework import serializers
from .models import (
    User, Service, Appointment, ToothChart, DentalRecord, 
    Document, InventoryItem, Billing, ClinicLocation, 
    TreatmentPlan, TeethImage
)

# Constants for repeated string literals
PATIENT_FULL_NAME = 'patient.get_full_name'
CREATED_BY_FULL_NAME = 'created_by.get_full_name'

class UserSerializer(serializers.ModelSerializer):
    last_appointment_date = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'user_type', 
                  'phone', 'address', 'birthday', 'age', 'profile_picture', 
                  'is_active_patient', 'created_at', 'last_appointment_date']
        extra_kwargs = {'password': {'write_only': True}}

    def get_last_appointment_date(self, obj):
        """Get the last appointment date for patients"""
        if obj.user_type == 'patient':
            return obj.get_last_appointment_date()
        return None

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = '__all__'


class AppointmentSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source=PATIENT_FULL_NAME, read_only=True)
    patient_email = serializers.CharField(source='patient.email', read_only=True)
    dentist_name = serializers.CharField(source='dentist.get_full_name', read_only=True)
    service_name = serializers.CharField(source='service.name', read_only=True)

    class Meta:
        model = Appointment
        fields = '__all__'


class ToothChartSerializer(serializers.ModelSerializer):
    class Meta:
        model = ToothChart
        fields = '__all__'


class DentalRecordSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source=CREATED_BY_FULL_NAME, read_only=True)

    class Meta:
        model = DentalRecord
        fields = '__all__'


class DocumentSerializer(serializers.ModelSerializer):
    uploaded_by_name = serializers.CharField(source='uploaded_by.get_full_name', read_only=True)

    class Meta:
        model = Document
        fields = '__all__'


class InventoryItemSerializer(serializers.ModelSerializer):
    is_low_stock = serializers.BooleanField(read_only=True)

    class Meta:
        model = InventoryItem
        fields = '__all__'


class BillingSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source=PATIENT_FULL_NAME, read_only=True)
    created_by_name = serializers.CharField(source=CREATED_BY_FULL_NAME, read_only=True)

    class Meta:
        model = Billing
        fields = '__all__'


class ClinicLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClinicLocation
        fields = '__all__'


class TreatmentPlanSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source=CREATED_BY_FULL_NAME, read_only=True)

    class Meta:
        model = TreatmentPlan
        fields = '__all__'


class TeethImageSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source=PATIENT_FULL_NAME, read_only=True)
    uploaded_by_name = serializers.CharField(source='uploaded_by.get_full_name', read_only=True)
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = TeethImage
        fields = ['id', 'patient', 'patient_name', 'image', 'image_url', 'notes', 
                  'uploaded_by', 'uploaded_by_name', 'is_latest', 'uploaded_at']
        read_only_fields = ['uploaded_at']

    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None
