from datetime import datetime
from typing import Any

def dt(v: datetime | None):
    return v.isoformat() if v else None

def user_dict(u):
    return {
        "id": u.id, "cognitoSub": u.cognito_sub, "email": u.email,
        "name": u.name, "role": u.role, "assignedCoaches": u.assigned_coaches,
        "employeeId": u.employee_id,
    }

def train_dict(t):
    return {
        "id": t.id, "number": t.number, "name": t.name, "source": t.source,
        "destination": t.destination, "currentStation": t.current_station,
        "nextStation": t.next_station, "departureTime": t.departure_time,
        "expectedArrival": t.expected_arrival, "status": t.status,
        "updatedAt": dt(t.updated_at),
    }

def coach_dict(c):
    return {
        "id": c.id, "trainId": c.train_id, "coachNumber": c.coach_number,
        "coachClass": c.coach_class, "totalBerths": c.total_berths,
        "occupiedBerths": c.occupied_berths, "vacantBerths": c.vacant_berths,
        "racCount": c.rac_count, "orderIndex": c.order_index,
    }

def seat_dict(s):
    return {
        "id": s.id, "coachId": s.coach_id, "trainId": s.train_id,
        "berthNumber": s.berth_number, "berthType": s.berth_type,
        "cabinNumber": s.cabin_number, "status": s.status,
        "passengerId": s.passenger_id, "passengerName": s.passenger_name,
        "updatedAt": dt(s.updated_at),
    }

def passenger_dict(p):
    return {
        "id": p.id, "pnr": p.pnr, "name": p.name, "age": p.age, "gender": p.gender,
        "trainId": p.train_id, "coachNumber": p.coach_number, "berthNumber": p.berth_number,
        "berthType": p.berth_type, "groupId": p.group_id, "requirement": p.requirement,
        "status": p.status, "sourceStation": p.source_station, "destStation": p.dest_station,
        "bookingDate": p.booking_date, "updatedAt": dt(p.updated_at),
    }

def recommendation_dict(r):
    return {
        "id": r.id, "trainId": r.train_id, "type": r.type,
        "affectedPassengers": r.affected_passengers, "currentAllocation": r.current_allocation,
        "proposedAllocation": r.proposed_allocation, "passengerId": r.passenger_id,
        "targetCoach": r.target_coach, "targetBerth": r.target_berth,
        "scoreBefore": r.score_before, "scoreAfter": r.score_after,
        "explanation": r.explanation, "status": r.status,
        "rejectionReason": r.rejection_reason, "createdAt": dt(r.created_at),
        "updatedAt": dt(r.updated_at),
    }

def event_dict(e):
    return {
        "id": e.id, "trainId": e.train_id, "eventType": e.event_type,
        "coachNumber": e.coach_number, "berthNumber": e.berth_number,
        "passengerId": e.passenger_id, "passengerName": e.passenger_name,
        "description": e.description, "actor": e.actor, "createdAt": dt(e.created_at),
    }
