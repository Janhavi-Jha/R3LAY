from datetime import datetime
from sqlalchemy import select
from .database import Base, engine, SessionLocal
from .models import User, Train, Coach, Seat, Passenger, Recommendation, LiveEvent, AuditLog, SystemSetting

BERTH_TYPES = ["LB", "MB", "UB", "LB", "MB", "UB", "SL", "SU"]

def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.scalar(select(Train.id).limit(1)):
            return

        db.add_all([
            User(cognito_sub="cog-sub-tte-rajesh-01", email="rajesh.kumar@irctc.gov.in",
                 name="Rajesh Kumar", role="TTE", assigned_coaches="B1,B2", employee_id="IR-TTE-4821"),
            User(cognito_sub="cog-sub-tte-priya-02", email="priya.sharma@irctc.gov.in",
                 name="Priya Sharma", role="CHIEF_TTE", assigned_coaches="B3,B4,H1", employee_id="IR-TTE-3910"),
        ])
        db.add(Train(
            id="12951", number="12951", name="Mumbai Tejas Rajdhani Express",
            source="New Delhi (NDLS)", destination="Mumbai Central (MMCT)",
            current_station="Mathura Jn (MTJ)", next_station="Kota Jn (KOTA)",
            departure_time="16:55", expected_arrival="08:35", status="RUNNING_ON_TIME"
        ))
        coach_data = [
            ("H1","1A",18,17,1,0,1), ("A1","2A",24,22,2,0,2),
            ("B1","3A",24,21,3,4,3), ("B2","3A",24,22,2,3,4),
            ("B3","3A",24,23,1,2,5), ("B4","3A",24,20,4,3,6),
            ("S1","SL",32,30,2,8,7), ("S2","SL",32,31,1,6,8),
        ]
        for num, cls, total, occ, vac, rac, order in coach_data:
            db.add(Coach(id=f"12951-{num}", train_id="12951", coach_number=num, coach_class=cls,
                         total_berths=total, occupied_berths=occ, vacant_berths=vac,
                         rac_count=rac, order_index=order))

        # Passenger manifest from the original frontend/backend package.
        pax = [
            ("PNR-284-9102481","284-9102481","Arun Verma",42,"M","B1",1,"LB","GRP-VERMA","Family Proximity","CONFIRMED","NDLS","MMCT","2025-02-14"),
            ("PNR-284-9102482","284-9102482","Sunita Verma",39,"F","B1",2,"MB","GRP-VERMA","Family Proximity","CONFIRMED","NDLS","MMCT","2025-02-14"),
            ("PNR-284-9102483","284-9102483","Kabir Verma",10,"M","B1",3,"UB","GRP-VERMA","Family Proximity","CONFIRMED","NDLS","MMCT","2025-02-14"),
            ("PNR-612-4982103","612-4982103","Meena Patel",54,"F","B1",5,"MB",None,"Lower Berth Preferred","CONFIRMED","NDLS","BRC","2025-02-10"),
            ("PNR-741-2098412","741-2098412","Rohan Nair",29,"M","B1",6,"UB",None,None,"CONFIRMED","NDLS","MMCT","2025-02-18"),
            ("PNR-891-3049102","891-3049102","Deepak Patel",34,"M","B1",7,"SL",None,"RAC Clearance Required","RAC","NDLS","ST","2025-02-20"),
            ("PNR-981-2450192","981-2450192","Vikash Mehta",46,"M","B1",9,"LB",None,None,"CONFIRMED","NDLS","MMCT","2025-02-11"),
            ("PNR-402-9182301","402-9182301","Ramprasad Sharma",72,"M","B1",15,"UB",None,"Senior Citizen Lower Berth","CONFIRMED","NDLS","KOTA","2025-02-05"),
            ("PNR-902-1829304","902-1829304","Alok Tiwari",38,"M","B1",23,"SL",None,"RAC Clearance","RAC","NDLS","MMCT","2025-02-22"),
            ("PNR-302-9841209","302-9841209","Ananya Roy",27,"F","B1",10,"MB","GRP-ROY","Family Proximity","CONFIRMED","NDLS","BVI","2025-02-15"),
            ("PNR-302-9841210","302-9841210","Ramesh Roy",63,"M","B1",11,"UB","GRP-ROY","Senior Citizen Need","CONFIRMED","NDLS","BVI","2025-02-15"),
            ("PNR-512-3984019","512-3984019","Kavita Joshi",33,"F","B1",13,"LB","GRP-JOSHI","Traveling with Infant","CONFIRMED","NDLS","MMCT","2025-02-09"),
            ("PNR-512-3984020","512-3984020","Pooja Joshi",61,"F","B1",14,"MB","GRP-JOSHI","Senior Citizen Need","CONFIRMED","NDLS","MMCT","2025-02-09"),
        ]
        for row in pax:
            pid,pnr,name,age,gender,coach,berth,btype,group,req,status,src,dst,date=row
            db.add(Passenger(id=pid,pnr=pnr,name=name,age=age,gender=gender,train_id="12951",
                coach_number=coach,berth_number=berth,berth_type=btype,group_id=group,
                requirement=req,status=status,source_station=src,dest_station=dst,booking_date=date))

        # Generate all seats. B1/B2 have the exact interactive manifest state; other coaches are usable capacity.
        b1_names = {
            1:("PNR-284-9102481","Arun Verma","OCCUPIED"),2:("PNR-284-9102482","Sunita Verma","OCCUPIED"),
            3:("PNR-284-9102483","Kabir Verma","OCCUPIED"),4:(None,None,"AVAILABLE"),
            5:("PNR-612-4982103","Meena Patel","OCCUPIED"),6:("PNR-741-2098412","Rohan Nair","OCCUPIED"),
            7:("PNR-891-3049102","Deepak Patel (RAC 1)","RAC"),8:("PNR-999-0000001","Suresh Gupta","OCCUPIED"),
            9:("PNR-981-2450192","Vikash Mehta","OCCUPIED"),10:("PNR-302-9841209","Ananya Roy","OCCUPIED"),
            11:("PNR-302-9841210","Ramesh Roy","OCCUPIED"),12:(None,None,"AVAILABLE"),
            13:("PNR-512-3984019","Kavita Joshi","OCCUPIED"),14:("PNR-512-3984020","Pooja Joshi","OCCUPIED"),
            15:("PNR-402-9182301","Ramprasad Sharma","OCCUPIED"),16:("PNR-999-0000002","Harish Iyer","OCCUPIED"),
            17:("PNR-999-0000003","Tanya Sen","OCCUPIED"),18:("PNR-999-0000004","Amitav Sen","OCCUPIED"),
            19:("PNR-999-0000005","Bhavna Rao","OCCUPIED"),20:("PNR-999-0000006","Nikhil Rao","OCCUPIED"),
            21:("PNR-999-0000007","Girish Kulkarni","OCCUPIED"),22:(None,None,"SUGGESTED"),
            23:("PNR-902-1829304","Alok Tiwari (RAC 2)","RAC"),24:("PNR-999-0000008","Manoj Deshmukh","OCCUPIED"),
        }
        coach_cap = {c[0]: c[2] for c in coach_data}
        for coach, total in coach_cap.items():
            for i in range(1,total+1):
                btype = BERTH_TYPES[(i-1)%8]
                cabin = (i-1)//8 + 1
                status="AVAILABLE"; pid=None; pname=None
                if coach=="B1" and i in b1_names:
                    pid,pname,status=b1_names[i]
                elif coach=="B2":
                    if i in (4,18): status="AVAILABLE"
                    elif i==7: status="RAC"; pid=f"PNR-B2-{1000+i}"; pname="B2 Passenger RAC"
                    else: status="OCCUPIED"; pid=f"PNR-B2-{1000+i}"; pname=f"Passenger B2-{i}"
                else:
                    # Fill enough seats to match coach occupancy while leaving configured vacancies.
                    c = next(x for x in coach_data if x[0]==coach)
                    if i <= c[3]: status="OCCUPIED"; pid=f"{coach}-P-{i}"; pname=f"{coach} Passenger {i}"
                db.add(Seat(id=f"12951-{coach}-{i:02d}",coach_id=f"12951-{coach}",train_id="12951",
                    berth_number=i,berth_type=btype,cabin_number=cabin,status=status,
                    passenger_id=pid,passenger_name=pname))

        db.add_all([
            Recommendation(id="REC-8491",train_id="12951",type="RAC_CLEARANCE",
                affected_passengers="Deepak Patel (PNR: 891-3049102)",
                current_allocation="B1 - Berth 7 (Side Lower / RAC)",
                proposed_allocation="B1 - Berth 4 (Lower Berth / Confirmed)",
                passenger_id="PNR-891-3049102",target_coach="B1",target_berth=4,score_before=58,score_after=92,
                explanation="Berth B1-04 became vacant at New Delhi chart clearance. Reallocating Deepak Patel (RAC 1) clears RAC queue and converts passenger to a full confirmed lower berth without disturbing any existing confirmed passenger.",
                status="PENDING"),
            Recommendation(id="REC-8492",train_id="12951",type="SENIOR_CITIZEN_PRIORITY",
                affected_passengers="Ramprasad Sharma (Age 72, PNR: 402-9182301)",
                current_allocation="B1 - Berth 15 (Upper Berth)",
                proposed_allocation="B1 - Berth 12 (Lower Berth)",
                passenger_id="PNR-402-9182301",target_coach="B1",target_berth=12,score_before=45,score_after=89,
                explanation="Ramprasad Sharma is 72 and currently assigned an Upper Berth (B1-15). Vacant B1-12 (LB) enables a lower-berth reassignment with minimal movement cost.",
                status="PENDING"),
            Recommendation(id="REC-8493",train_id="12951",type="RAC_CLEARANCE",
                affected_passengers="Alok Tiwari (PNR: 902-1829304)",
                current_allocation="B1 - Berth 23 (Side Lower / RAC)",
                proposed_allocation="B1 - Berth 22 (Side Upper / Confirmed)",
                passenger_id="PNR-902-1829304",target_coach="B1",target_berth=22,score_before=62,score_after=86,
                explanation="B1-22 is currently unallocated. Moving RAC 2 passenger Alok Tiwari to B1-22 provides a confirmed sleeping berth before the next major station.",
                status="PENDING"),
        ])
        db.add_all([
            LiveEvent(train_id="12951",event_type="BOARDING",coach_number="B1",berth_number=1,
                      passenger_id="PNR-284-9102481",passenger_name="Arun Verma",
                      description="Passenger Arun Verma boarded at New Delhi (NDLS). Ticket scanned by TTE Rajesh Kumar.",actor="TTE Rajesh Kumar"),
            LiveEvent(train_id="12951",event_type="SEAT_RELEASED",coach_number="B1",berth_number=4,
                      description="Chart finalization released Berth B1-04 as vacant at NDLS station.",actor="CRIS System"),
            LiveEvent(train_id="12951",event_type="RAC_CONVERSION",coach_number="B2",berth_number=7,
                      passenger_id="PNR-B2-1007",passenger_name="B2 Passenger RAC",
                      description="RAC passenger assigned shared Side Lower berth B2-07.",actor="IRCTC PRS"),
            LiveEvent(train_id="12951",event_type="MANUAL_ADJUSTMENT",coach_number="B1",berth_number=13,
                      passenger_id="PNR-512-3984019",passenger_name="Kavita Joshi",
                      description="Infant tag noted for Kavita Joshi on B1-13 Lower Berth.",actor="TTE Rajesh Kumar"),
        ])
        db.add(AuditLog(action="SYSTEM_INITIALIZE",performed_by="TTE Rajesh Kumar",role="TTE",
                         details="Train 12951 journey session initialized at NDLS. Coach sync completed for B1 and B2.",
                         metadata_json={"trainId":"12951","coaches":["B1","B2"]}))
        db.add(SystemSetting(key="optimization_weights",value={
            "familyProximity":85,"seniorCitizenPriority":95,"movementMinimization":65,"racClearance":90,
            "enableAutoOptimization":False,"solverEngine":"Google OR-Tools CP-SAT",
            "bedrockModel":"anthropic.claude-3-sonnet-20240229-v1:0"}))
        db.add(SystemSetting(key="aws_config",value={
            "apiGatewayUrl":"http://127.0.0.1:8000/api","cognitoUserPoolId":"",
            "cognitoClientId":"","cognitoRegion":"ap-south-1","dynamoDbTable":"r3lay-train-state-dev",
            "eventBridgeBus":"r3lay-events-bus-dev"}))
        db.commit()
    finally:
        db.close()
