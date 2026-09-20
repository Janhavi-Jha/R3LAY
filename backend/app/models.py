from datetime import datetime
from sqlalchemy import String, Integer, Boolean, DateTime, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column
from .database import Base

class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    cognito_sub: Mapped[str] = mapped_column(String(120), unique=True)
    email: Mapped[str] = mapped_column(String(200), unique=True)
    name: Mapped[str] = mapped_column(String(120))
    role: Mapped[str] = mapped_column(String(40), default="TTE")
    assigned_coaches: Mapped[str] = mapped_column(String(120), default="B1,B2")
    employee_id: Mapped[str] = mapped_column(String(80), unique=True)
    active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class Train(Base):
    __tablename__ = "trains"
    id: Mapped[str] = mapped_column(String(40), primary_key=True)
    number: Mapped[str] = mapped_column(String(40))
    name: Mapped[str] = mapped_column(String(200))
    source: Mapped[str] = mapped_column(String(120))
    destination: Mapped[str] = mapped_column(String(120))
    current_station: Mapped[str] = mapped_column(String(120))
    next_station: Mapped[str] = mapped_column(String(120))
    departure_time: Mapped[str] = mapped_column(String(20))
    expected_arrival: Mapped[str] = mapped_column(String(20))
    status: Mapped[str] = mapped_column(String(60), default="RUNNING_ON_TIME")
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class Coach(Base):
    __tablename__ = "coaches"
    id: Mapped[str] = mapped_column(String(80), primary_key=True)
    train_id: Mapped[str] = mapped_column(String(40))
    coach_number: Mapped[str] = mapped_column(String(20))
    coach_class: Mapped[str] = mapped_column(String(20))
    total_berths: Mapped[int] = mapped_column(Integer)
    occupied_berths: Mapped[int] = mapped_column(Integer, default=0)
    vacant_berths: Mapped[int] = mapped_column(Integer, default=0)
    rac_count: Mapped[int] = mapped_column(Integer, default=0)
    order_index: Mapped[int] = mapped_column(Integer, default=0)

class Seat(Base):
    __tablename__ = "seats"
    id: Mapped[str] = mapped_column(String(100), primary_key=True)
    coach_id: Mapped[str] = mapped_column(String(80))
    train_id: Mapped[str] = mapped_column(String(40))
    berth_number: Mapped[int] = mapped_column(Integer)
    berth_type: Mapped[str] = mapped_column(String(10))
    cabin_number: Mapped[int] = mapped_column(Integer)
    status: Mapped[str] = mapped_column(String(30), default="AVAILABLE")
    passenger_id: Mapped[str | None] = mapped_column(String(100), nullable=True)
    passenger_name: Mapped[str | None] = mapped_column(String(160), nullable=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class Passenger(Base):
    __tablename__ = "passengers"
    id: Mapped[str] = mapped_column(String(100), primary_key=True)
    pnr: Mapped[str] = mapped_column(String(80))
    name: Mapped[str] = mapped_column(String(160))
    age: Mapped[int] = mapped_column(Integer)
    gender: Mapped[str] = mapped_column(String(20))
    train_id: Mapped[str] = mapped_column(String(40))
    coach_number: Mapped[str] = mapped_column(String(20))
    berth_number: Mapped[int | None] = mapped_column(Integer, nullable=True)
    berth_type: Mapped[str | None] = mapped_column(String(10), nullable=True)
    group_id: Mapped[str | None] = mapped_column(String(80), nullable=True)
    requirement: Mapped[str | None] = mapped_column(String(160), nullable=True)
    status: Mapped[str] = mapped_column(String(30), default="CONFIRMED")
    source_station: Mapped[str] = mapped_column(String(80))
    dest_station: Mapped[str] = mapped_column(String(80))
    booking_date: Mapped[str] = mapped_column(String(30))
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class Recommendation(Base):
    __tablename__ = "recommendations"
    id: Mapped[str] = mapped_column(String(100), primary_key=True)
    train_id: Mapped[str] = mapped_column(String(40))
    type: Mapped[str] = mapped_column(String(60))
    affected_passengers: Mapped[str] = mapped_column(Text)
    current_allocation: Mapped[str] = mapped_column(Text)
    proposed_allocation: Mapped[str] = mapped_column(Text)
    passenger_id: Mapped[str] = mapped_column(String(100))
    target_coach: Mapped[str] = mapped_column(String(20))
    target_berth: Mapped[int] = mapped_column(Integer)
    score_before: Mapped[int] = mapped_column(Integer)
    score_after: Mapped[int] = mapped_column(Integer)
    explanation: Mapped[str] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(30), default="PENDING")
    rejection_reason: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class LiveEvent(Base):
    __tablename__ = "live_events"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    train_id: Mapped[str] = mapped_column(String(40))
    event_type: Mapped[str] = mapped_column(String(60))
    coach_number: Mapped[str | None] = mapped_column(String(20), nullable=True)
    berth_number: Mapped[int | None] = mapped_column(Integer, nullable=True)
    passenger_id: Mapped[str | None] = mapped_column(String(100), nullable=True)
    passenger_name: Mapped[str | None] = mapped_column(String(160), nullable=True)
    description: Mapped[str] = mapped_column(Text)
    actor: Mapped[str] = mapped_column(String(160), default="SYSTEM")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    action: Mapped[str] = mapped_column(String(100))
    performed_by: Mapped[str] = mapped_column(String(160))
    role: Mapped[str] = mapped_column(String(40))
    details: Mapped[str] = mapped_column(Text)
    metadata_json: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class SystemSetting(Base):
    __tablename__ = "system_settings"
    key: Mapped[str] = mapped_column(String(100), primary_key=True)
    value: Mapped[dict] = mapped_column(JSON)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
