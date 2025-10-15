from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import *


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'user_type', 'is_active')
    list_filter = ('user_type', 'is_active', 'is_staff')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    ordering = ('-date_joined',)
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('user_type', 'phone', 'birthday', 'age', 'address', 'profile_picture', 'is_active_patient')}),
    )

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'created_at')
    list_filter = ('category', 'created_at')
    search_fields = ('name', 'description')
    ordering = ('-created_at',)

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('patient', 'dentist', 'date', 'time', 'status', 'service')
    list_filter = ('status', 'date', 'dentist')
    search_fields = ('patient__username', 'patient__email', 'notes')
    ordering = ('-date', '-time')
    date_hierarchy = 'date'

@admin.register(ToothChart)
class ToothChartAdmin(admin.ModelAdmin):
    list_display = ('patient', 'updated_at')
    search_fields = ('patient__username',)
    ordering = ('patient',)

@admin.register(DentalRecord)
class DentalRecordAdmin(admin.ModelAdmin):
    list_display = ('patient', 'treatment', 'created_at', 'created_by')
    list_filter = ('created_at', 'created_by')
    search_fields = ('patient__username', 'treatment', 'notes')
    ordering = ('-created_at',)
    date_hierarchy = 'created_at'

@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ('patient', 'document_type', 'title', 'uploaded_at')
    list_filter = ('document_type', 'uploaded_at')
    search_fields = ('patient__username', 'title')
    ordering = ('-uploaded_at',)

@admin.register(InventoryItem)
class InventoryItemAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'quantity', 'min_stock', 'cost', 'supplier', 'updated_at')
    list_filter = ('category', 'updated_at')
    search_fields = ('name', 'supplier')
    ordering = ('name',)
    
    def get_list_display(self, request):
        list_display = super().get_list_display(request)
        return list_display

@admin.register(Billing)
class BillingAdmin(admin.ModelAdmin):
    list_display = ('patient', 'amount', 'paid', 'created_at')
    list_filter = ('paid', 'created_at')
    search_fields = ('patient__username', 'description')
    ordering = ('-created_at',)
    date_hierarchy = 'created_at'

@admin.register(ClinicLocation)
class ClinicLocationAdmin(admin.ModelAdmin):
    list_display = ('name', 'address', 'phone')
    search_fields = ('name', 'address')

@admin.register(TreatmentPlan)
class TreatmentPlanAdmin(admin.ModelAdmin):
    list_display = ('patient', 'title', 'status', 'start_date', 'created_by')
    list_filter = ('status', 'start_date')
    search_fields = ('patient__username', 'title', 'description')
    ordering = ('-start_date',)

admin.site.site_header = "Dental Clinic Administration"
admin.site.site_title = "Dental Clinic Admin"
admin.site.index_title = "Welcome to Dental Clinic Management System"
