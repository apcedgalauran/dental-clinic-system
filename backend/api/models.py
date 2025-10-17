from django.db import models
from django.contrib.auth.models import AbstractUser
from datetime import datetime, timedelta
from django.utils import timezone

class User(AbstractUser):
    USER_TYPES = (
        ('patient', 'Patient'),
        ('staff', 'Receptionist/Dentist'),
        ('owner', 'Owner'),
    )
    STAFF_ROLES = (
        ('', 'Not Assigned'),
        ('receptionist', 'Receptionist'),
        ('dentist', 'Dentist'),
    )
    user_type = models.CharField(max_length=20, choices=USER_TYPES, default='patient')
    role = models.CharField(max_length=20, choices=STAFF_ROLES, blank=True, default='')
    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    birthday = models.DateField(null=True, blank=True)
    age = models.IntegerField(null=True, blank=True)
    profile_picture = models.ImageField(upload_to='profiles/', null=True, blank=True)
    is_active_patient = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    # Override email to make it unique and required
    email = models.EmailField(unique=True, blank=False)

    def __str__(self):
        return f"{self.get_full_name()} ({self.user_type})"
    
    def update_patient_status(self):
        """Update patient status based on last appointment date"""
        if self.user_type != 'patient':
            return
        
        try:
            # Get last appointment
            last_appointment = self.patient_appointments.order_by('-date').first()
            
            if last_appointment:
                # Calculate if last appointment was more than 2 years ago
                two_years_ago = timezone.now().date() - timedelta(days=730)
                if last_appointment.date < two_years_ago:
                    self.is_active_patient = False
                else:
                    self.is_active_patient = True
            else:
                # No appointments yet - keep as active for new patients
                self.is_active_patient = True
            
            self.save(update_fields=['is_active_patient'])
        except Exception:
            # If patient_appointments relationship doesn't exist yet, keep as active
            self.is_active_patient = True
    
    def get_last_appointment_date(self):
        """Get the date of the last appointment"""
        try:
            last_appointment = self.patient_appointments.order_by('-date').first()
            return last_appointment.date if last_appointment else None
        except Exception:
            # If patient_appointments relationship doesn't exist yet, return None
            return None


class Service(models.Model):
    CATEGORIES = (
        ('all', 'All Services'),
        ('orthodontics', 'Orthodontics'),
        ('restorations', 'Restorations'),
        ('xrays', 'X-Rays'),
        ('oral_surgery', 'Oral Surgery'),
        ('preventive', 'Preventive'),
    )
    name = models.CharField(max_length=200)
    category = models.CharField(max_length=50, choices=CATEGORIES)
    description = models.TextField()
    image = models.ImageField(upload_to='services/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Appointment(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
        ('reschedule_requested', 'Reschedule Requested'),
        ('cancel_requested', 'Cancel Requested'),
    )
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='appointments')
    dentist = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='dentist_appointments')
    service = models.ForeignKey(Service, on_delete=models.SET_NULL, null=True)
    date = models.DateField()
    time = models.TimeField()
    status = models.CharField(max_length=25, choices=STATUS_CHOICES, default='pending')
    notes = models.TextField(blank=True)
    
    # Reschedule request fields
    reschedule_date = models.DateField(null=True, blank=True)
    reschedule_time = models.TimeField(null=True, blank=True)
    reschedule_service = models.ForeignKey(Service, on_delete=models.SET_NULL, null=True, blank=True, related_name='reschedule_requests')
    reschedule_dentist = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='reschedule_requests')
    reschedule_notes = models.TextField(blank=True)
    
    # Cancel request fields
    cancel_reason = models.TextField(blank=True)
    cancel_requested_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date', '-time']

    def __str__(self):
        return f"{self.patient.get_full_name()} - {self.date} {self.time}"


class ToothChart(models.Model):
    patient = models.OneToOneField(User, on_delete=models.CASCADE, related_name='tooth_chart')
    chart_data = models.JSONField(default=dict)
    notes = models.TextField(blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Tooth Chart - {self.patient.get_full_name()}"


class DentalRecord(models.Model):
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='dental_records')
    appointment = models.ForeignKey(Appointment, on_delete=models.SET_NULL, null=True, blank=True)
    treatment = models.TextField()
    diagnosis = models.TextField(blank=True)
    notes = models.TextField(blank=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_records')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.patient.get_full_name()} - {self.created_at.date()}"


class Document(models.Model):
    DOCUMENT_TYPES = (
        ('xray', 'X-Ray'),
        ('scan', 'Tooth Scan'),
        ('report', 'Report'),
        ('other', 'Other'),
    )
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='documents')
    document_type = models.CharField(max_length=20, choices=DOCUMENT_TYPES)
    file = models.FileField(upload_to='documents/')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    uploaded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='uploaded_documents')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-uploaded_at']

    def __str__(self):
        return f"{self.title} - {self.patient.get_full_name()}"


class InventoryItem(models.Model):
    name = models.CharField(max_length=200)
    category = models.CharField(max_length=100)
    quantity = models.IntegerField(default=0)
    min_stock = models.IntegerField(default=10)
    supplier = models.CharField(max_length=200, blank=True)
    cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    @property
    def is_low_stock(self):
        return self.quantity <= self.min_stock


class Billing(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('cancelled', 'Cancelled'),
    )
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='billings')
    appointment = models.ForeignKey(Appointment, on_delete=models.SET_NULL, null=True, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    soa_file = models.FileField(upload_to='billing/', null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    paid = models.BooleanField(default=False)  # Keep for backward compatibility
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_billings')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        # Auto-sync paid field with status
        self.paid = (self.status == 'paid')
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.patient.get_full_name()} - PHP {self.amount}"


class ClinicLocation(models.Model):
    name = models.CharField(max_length=200)
    address = models.TextField()
    phone = models.CharField(max_length=20)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)

    def __str__(self):
        return self.name


class TreatmentPlan(models.Model):
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='treatment_plans')
    title = models.CharField(max_length=200)
    description = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=[
        ('planned', 'Planned'),
        ('ongoing', 'Ongoing'),
        ('completed', 'Completed'),
    ], default='planned')
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_plans')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.patient.get_full_name()}"


class TeethImage(models.Model):
    """Model for storing patient teeth images"""
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='teeth_images')
    image = models.ImageField(upload_to='teeth_images/')
    notes = models.TextField(blank=True)
    uploaded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='uploaded_teeth_images')
    is_latest = models.BooleanField(default=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-uploaded_at']
        verbose_name = 'Teeth Image'
        verbose_name_plural = 'Teeth Images'

    def save(self, *args, **kwargs):
        # Mark all other patient images as not latest BEFORE saving this one
        # to avoid the new image appearing in the wrong position
        if self.is_latest and not self.pk:
            # Only update if this is a new record (no primary key yet)
            TeethImage.objects.filter(patient=self.patient, is_latest=True).update(is_latest=False)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Teeth Image - {self.patient.get_full_name()} - {self.uploaded_at.date()}"
