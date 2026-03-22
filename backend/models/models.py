from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    name = Column(String(255))
    password_hash = Column(String(255))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class SystemMetric(Base):
    __tablename__ = "system_metrics"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    recorded_at = Column(DateTime(timezone=True), server_default=func.now())
    cpu_percent = Column(Float)
    ram_used_gb = Column(Float)
    ram_percent = Column(Float)
    disk_read_mb = Column(Float)
    disk_write_mb = Column(Float)
    network_sent_mb = Column(Float)
    network_recv_mb = Column(Float)
    cpu_temp = Column(Float)

class ProcessMetric(Base):
    __tablename__ = "process_metrics"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    recorded_at = Column(DateTime(timezone=True), server_default=func.now())
    pid = Column(Integer)
    name = Column(String(255))
    cpu_percent = Column(Float)
    ram_mb = Column(Float)
    status = Column(String(50))

class AutopilotAction(Base):
    __tablename__ = "autopilot_actions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    action_type = Column(String(100))
    target_name = Column(String(255))
    pid = Column(Integer)
    reason = Column(Text)
    executed_at = Column(DateTime(timezone=True), server_default=func.now())
    executed_by = Column(String(50))

class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    prediction_type = Column(String(50))
    probability = Column(Float)
    risk_level = Column(String(20))
    predicted_at = Column(DateTime(timezone=True), server_default=func.now())

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    sender = Column(String(50))
    message = Column(Text)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

class UserBaseline(Base):
    __tablename__ = "user_baselines"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    hour_of_day = Column(Integer)
    avg_cpu = Column(Float)
    avg_ram = Column(Float)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
