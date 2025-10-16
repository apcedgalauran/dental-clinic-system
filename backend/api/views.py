from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.db.models import Sum, Count, Q
from datetime import date, timedelta
from .models import (
    User, Service, Appointment, ToothChart, DentalRecord,
    Document, InventoryItem, Billing, ClinicLocation,
    TreatmentPlan, TeethImage
)
from .serializers import (
    UserSerializer, ServiceSerializer, AppointmentSerializer,
    ToothChartSerializer, DentalRecordSerializer, DocumentSerializer,
    InventoryItemSerializer, BillingSerializer, ClinicLocationSerializer,
    TreatmentPlanSerializer, TeethImageSerializer
)


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    print("[Django] Registration request received:", request.data)
    
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        print("[Django] Serializer is valid, creating user")
        user = serializer.save()
        user.set_password(request.data.get('password'))
        user.save()
        token, _ = Token.objects.get_or_create(user=user)
        print("[Django] User created successfully:", user.username)
        return Response({'token': token.key, 'user': serializer.data}, status=status.HTTP_201_CREATED)
    
    print("[Django] Serializer errors:", serializer.errors)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    print(f"[Django] Login attempt for username: {username}")
    
    # Try to authenticate with username first
    user = authenticate(username=username, password=password)
    
    # If authentication fails, try to find user by email and authenticate
    if not user:
        try:
            user_obj = User.objects.get(email=username)
            user = authenticate(username=user_obj.username, password=password)
            print(f"[Django] Found user by email: {username}, trying with username: {user_obj.username}")
        except User.DoesNotExist:
            print(f"[Django] No user found with email: {username}")
    
    if user:
        token, _ = Token.objects.get_or_create(user=user)
        serializer = UserSerializer(user)
        print(f"[Django] Login successful for: {username}")
        return Response({'token': token.key, 'user': serializer.data})
    
    print(f"[Django] Login failed for: {username}")
    return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
def logout(request):
    request.user.auth_token.delete()
    return Response({'message': 'Logged out successfully'})


@api_view(['GET'])
def current_user(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    @action(detail=False, methods=['get'])
    def patients(self, request):
        patients = User.objects.filter(user_type='patient')
        
        # Update patient status based on last appointment (2-year rule)
        for patient in patients:
            patient.update_patient_status()
        
        serializer = self.get_serializer(patients, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def staff(self, request):
        staff = User.objects.filter(user_type__in=['staff', 'owner'])
        serializer = self.get_serializer(staff, many=True)
        return Response(serializer.data)


class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [AllowAny]

    @action(detail=False, methods=['get'])
    def by_category(self, request):
        category = request.query_params.get('category', 'all')
        if category == 'all':
            services = Service.objects.all()
        else:
            services = Service.objects.filter(category=category)
        serializer = self.get_serializer(services, many=True)
        return Response(serializer.data)


class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer

    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'patient':
            return Appointment.objects.filter(patient=user)
        return Appointment.objects.all()
    
    def perform_create(self, serializer):
        """Update patient status after creating appointment"""
        appointment = serializer.save()
        if appointment.patient:
            appointment.patient.update_patient_status()
    
    def perform_update(self, serializer):
        """Update patient status after updating appointment"""
        appointment = serializer.save()
        if appointment.patient:
            appointment.patient.update_patient_status()

    @action(detail=False, methods=['get'])
    def today(self, request):
        today_appointments = Appointment.objects.filter(date=date.today())
        serializer = self.get_serializer(today_appointments, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        upcoming = Appointment.objects.filter(date__gte=date.today(), status__in=['pending', 'confirmed'])
        serializer = self.get_serializer(upcoming, many=True)
        return Response(serializer.data)


class ToothChartViewSet(viewsets.ModelViewSet):
    queryset = ToothChart.objects.all()
    serializer_class = ToothChartSerializer


class DentalRecordViewSet(viewsets.ModelViewSet):
    queryset = DentalRecord.objects.all()
    serializer_class = DentalRecordSerializer

    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'patient':
            return DentalRecord.objects.filter(patient=user)
        return DentalRecord.objects.all()


class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer

    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'patient':
            return Document.objects.filter(patient=user)
        return Document.objects.all()


class InventoryItemViewSet(viewsets.ModelViewSet):
    queryset = InventoryItem.objects.all()
    serializer_class = InventoryItemSerializer

    @action(detail=False, methods=['get'])
    def low_stock(self, request):
        low_stock_items = [item for item in InventoryItem.objects.all() if item.is_low_stock]
        serializer = self.get_serializer(low_stock_items, many=True)
        return Response(serializer.data)


class BillingViewSet(viewsets.ModelViewSet):
    queryset = Billing.objects.all()
    serializer_class = BillingSerializer

    def get_queryset(self):
        user = self.request.user
        queryset = Billing.objects.all()
        
        # Filter by patient if user is a patient
        if user.user_type == 'patient':
            queryset = queryset.filter(patient=user)
        
        # Filter by status if provided
        status_filter = self.request.query_params.get('status', None)
        if status_filter and status_filter in ['pending', 'paid', 'cancelled']:
            queryset = queryset.filter(status=status_filter)
        
        return queryset

    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        """Update billing status"""
        billing = self.get_object()
        new_status = request.data.get('status')
        
        if new_status not in ['pending', 'paid', 'cancelled']:
            return Response(
                {'error': 'Invalid status. Must be pending, paid, or cancelled.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        billing.status = new_status
        billing.save()
        
        serializer = self.get_serializer(billing)
        return Response(serializer.data)


class ClinicLocationViewSet(viewsets.ModelViewSet):
    queryset = ClinicLocation.objects.all()
    serializer_class = ClinicLocationSerializer
    permission_classes = [AllowAny]


class TreatmentPlanViewSet(viewsets.ModelViewSet):
    queryset = TreatmentPlan.objects.all()
    serializer_class = TreatmentPlanSerializer

    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'patient':
            return TreatmentPlan.objects.filter(patient=user)
        return TreatmentPlan.objects.all()


class TeethImageViewSet(viewsets.ModelViewSet):
    queryset = TeethImage.objects.all()
    serializer_class = TeethImageSerializer

    def get_queryset(self):
        user = self.request.user
        queryset = TeethImage.objects.all()
        
        # Filter by patient if user is a patient
        if user.user_type == 'patient':
            queryset = queryset.filter(patient=user)
        
        # Filter by patient_id if provided (for staff/owner viewing specific patient)
        patient_id = self.request.query_params.get('patient_id', None)
        if patient_id:
            queryset = queryset.filter(patient_id=patient_id)
        
        return queryset

    def perform_create(self, serializer):
        """Set uploaded_by to current user"""
        serializer.save(uploaded_by=self.request.user)

    @action(detail=False, methods=['get'])
    def latest(self, request):
        """Get latest teeth image for a patient"""
        patient_id = request.query_params.get('patient_id')
        
        if not patient_id:
            if request.user.user_type == 'patient':
                patient_id = request.user.id
            else:
                return Response(
                    {'error': 'patient_id parameter is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        try:
            latest_image = TeethImage.objects.filter(
                patient_id=patient_id,
                is_latest=True
            ).first()
            
            if latest_image:
                serializer = self.get_serializer(latest_image)
                return Response(serializer.data)
            else:
                return Response(
                    {'message': 'No teeth images found for this patient'},
                    status=status.HTTP_404_NOT_FOUND
                )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=False, methods=['get'])
    def by_patient(self, request):
        """Get all teeth images for a specific patient"""
        patient_id = request.query_params.get('patient_id')
        
        if not patient_id:
            if request.user.user_type == 'patient':
                patient_id = request.user.id
            else:
                return Response(
                    {'error': 'patient_id parameter is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        images = TeethImage.objects.filter(patient_id=patient_id)
        serializer = self.get_serializer(images, many=True)
        return Response(serializer.data)


@api_view(['GET'])
def analytics(request):
    # Revenue from billing
    total_revenue = Billing.objects.filter(paid=True).aggregate(Sum('amount'))['amount__sum'] or 0
    
    # Expenses from inventory
    total_expenses = InventoryItem.objects.aggregate(
        total=Sum(models.F('cost') * models.F('quantity'))
    )['total'] or 0
    
    # Patient statistics
    total_patients = User.objects.filter(user_type='patient').count()
    active_patients = User.objects.filter(user_type='patient', is_active_patient=True).count()
    new_patients_this_month = User.objects.filter(
        user_type='patient',
        created_at__month=date.today().month
    ).count()
    
    # Appointment statistics
    total_appointments = Appointment.objects.count()
    upcoming_appointments = Appointment.objects.filter(
        date__gte=date.today(),
        status__in=['pending', 'confirmed']
    ).count()
    
    return Response({
        'revenue': float(total_revenue),
        'expenses': float(total_expenses),
        'profit': float(total_revenue - total_expenses),
        'total_patients': total_patients,
        'active_patients': active_patients,
        'new_patients_this_month': new_patients_this_month,
        'total_appointments': total_appointments,
        'upcoming_appointments': upcoming_appointments,
    })
