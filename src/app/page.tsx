"use client";

import React, { useState, useEffect, useCallback } from "react";
import { LoginScreen } from "@/components/LoginScreen";
import { Header } from "@/components/Header";
import { Sidebar, NavTab } from "@/components/Sidebar";
import { DashboardView } from "@/components/DashboardView";
import { TrainOverviewView } from "@/components/TrainOverviewView";
import { CoachMapView } from "@/components/CoachMapView";
import { PassengersView } from "@/components/PassengersView";
import { RecommendationsView } from "@/components/RecommendationsView";
import { LiveEventsView } from "@/components/LiveEventsView";
import { AnalyticsView } from "@/components/AnalyticsView";
import { AssistantView } from "@/components/AssistantView";
import { ReportsView } from "@/components/ReportsView";
import { SettingsView } from "@/components/SettingsView";
import { SeatModal } from "@/components/SeatModal";
import { RejectReasonModal } from "@/components/RejectReasonModal";
import { QuickNoShowModal } from "@/components/QuickNoShowModal";
import { AwsConfigModal } from "@/components/AwsConfigModal";
import { R3layApi } from "@/lib/api";
import { getStoredUser, isAuthenticated, clearAuthSession, UserProfile } from "@/lib/auth";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export default function App() {
  // Auth state
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Active navigation
  const [activeTab, setActiveTab] = useState<NavTab>("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Train and coach data
  const [train, setTrain] = useState<any>(null);
  const [coaches, setCoaches] = useState<any[]>([]);
  const [selectedCoachId, setSelectedCoachId] = useState("B1");
  const [coachSeats, setCoachSeats] = useState<any[]>([]);
  const [passengers, setPassengers] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  // Loading states
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingSeats, setIsLoadingSeats] = useState(false);
  const [isLoadingPassengers, setIsLoadingPassengers] = useState(false);
  const [isLoadingRecs, setIsLoadingRecs] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Search
  const [passengerSearchQuery, setPassengerSearchQuery] = useState("");

  // Modals
  const [selectedSeat, setSelectedSeat] = useState<any>(null);
  const [rejectingRec, setRejectingRec] = useState<any>(null);
  const [showQuickNoShow, setShowQuickNoShow] = useState(false);
  const [showAwsConfig, setShowAwsConfig] = useState(false);

  // Toast notifications
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4500);
  };

  // 1. Initial auth check
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (isAuthenticated()) {
        const u = getStoredUser();
        setCurrentUser(u);
      }
      setAuthChecked(true);

      const handleExpired = () => {
        setCurrentUser(null);
        showToast("Your session has expired. Please sign in with Cognito again.", "error");
      };

      window.addEventListener("r3lay:auth:expired", handleExpired);
      return () => window.removeEventListener("r3lay:auth:expired", handleExpired);
    }
  }, []);

  // 2. Fetch train & rake details
  const loadTrainData = useCallback(async () => {
    try {
      const trainRes = await R3layApi.getTrains();
      if (trainRes.trains && trainRes.trains.length > 0) {
        setTrain(trainRes.trains[0]);
        if (trainRes.trains[0].coaches) {
          setCoaches(trainRes.trains[0].coaches);
        }
      }
    } catch (err: any) {
      console.error("Train load error:", err);
    }
  }, []);

  // 3. Fetch coach seats
  const loadSeats = useCallback(async (coachNumber: string) => {
    setIsLoadingSeats(true);
    try {
      const res = await R3layApi.getCoachSeats(coachNumber);
      setCoachSeats(res.seats || []);
    } catch (err: any) {
      console.error("Seats load error:", err);
    } finally {
      setIsLoadingSeats(false);
    }
  }, []);

  // 4. Fetch passengers
  const loadPassengers = useCallback(async (query: string = "") => {
    setIsLoadingPassengers(true);
    try {
      const res = await R3layApi.getPassengers({ search: query });
      setPassengers(res.passengers || []);
    } catch (err: any) {
      console.error("Passengers load error:", err);
    } finally {
      setIsLoadingPassengers(false);
    }
  }, []);

  // 5. Fetch recommendations
  const loadRecommendations = useCallback(async () => {
    setIsLoadingRecs(true);
    try {
      const res = await R3layApi.getRecommendations();
      setRecommendations(res.recommendations || []);
    } catch (err: any) {
      console.error("Recs load error:", err);
    } finally {
      setIsLoadingRecs(false);
    }
  }, []);

  // 6. Fetch live events
  const loadEvents = useCallback(async () => {
    try {
      const res = await R3layApi.getEvents();
      setEvents(res.events || []);
    } catch (err: any) {
      console.error("Events load error:", err);
    }
  }, []);

  // Master refresh
  const refreshAll = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        loadTrainData(),
        loadSeats(selectedCoachId),
        loadPassengers(passengerSearchQuery),
        loadRecommendations(),
        loadEvents(),
      ]);
      showToast("Synchronized live manifest with backend API Gateway", "info");
    } catch (err: any) {
      showToast("Sync failed: " + err.message, "error");
    } finally {
      setIsRefreshing(false);
    }
  }, [loadTrainData, loadSeats, selectedCoachId, loadPassengers, passengerSearchQuery, loadRecommendations, loadEvents]);

  // Load data when authenticated or coach selection changes
  useEffect(() => {
    if (currentUser) {
      refreshAll();
    }
  }, [currentUser, refreshAll]);

  useEffect(() => {
    if (currentUser && selectedCoachId) {
      loadSeats(selectedCoachId);
    }
  }, [currentUser, selectedCoachId, loadSeats]);

  // Handle Login Success
  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    showToast(`Welcome ${user.name}! Authenticated via AWS Cognito.`, "success");
  };

  // Handle Logout
  const handleLogout = () => {
    clearAuthSession();
    setCurrentUser(null);
    showToast("Signed out. Cognito session cleared.", "info");
  };

  // Approve Recommendation Action
  const handleApproveRec = async (recId: string) => {
    setApprovingId(recId);
    try {
      const res = await R3layApi.approveRecommendation(recId);
      if (res.success) {
        showToast(res.message || `Recommendation ${recId} approved!`, "success");
        await Promise.all([
          loadRecommendations(),
          loadSeats(selectedCoachId),
          loadPassengers(),
          loadTrainData(),
          loadEvents(),
        ]);
      }
    } catch (err: any) {
      showToast(err.message || "Approval failed due to seat conflict", "error");
    } finally {
      setApprovingId(null);
    }
  };

  // Reject Recommendation Action
  const handleConfirmReject = async (recId: string, reason: string) => {
    setIsRejecting(true);
    try {
      const res = await R3layApi.rejectRecommendation(recId, reason);
      if (res.success) {
        showToast(`Recommendation ${recId} rejected.`, "info");
        setRejectingRec(null);
        await Promise.all([loadRecommendations(), loadSeats(selectedCoachId), loadEvents()]);
      }
    } catch (err: any) {
      showToast(err.message || "Failed to reject recommendation", "error");
    } finally {
      setIsRejecting(false);
    }
  };

  // Run AI Optimization Action
  const handleRunOptimization = async () => {
    setIsOptimizing(true);
    try {
      const res = await R3layApi.runOptimization();
      if (res.success) {
        showToast(
          `${res.message} (${res.solverEngine})`,
          "success"
        );
        await Promise.all([
          loadRecommendations(),
          loadSeats(selectedCoachId),
          loadEvents(),
        ]);
      }
    } catch (err: any) {
      showToast(err.message || "Optimization solver encountered an error", "error");
    } finally {
      setIsOptimizing(false);
    }
  };

  // Mark No-Show Action
  const handleMarkNoShow = async (params: { passengerId?: string; pnr?: string; coachNumber?: string; berthNumber?: number; reason?: string }) => {
    setIsActionLoading(true);
    try {
      const res = await R3layApi.markNoShow(params);
      if (res.success) {
        showToast(res.message, "success");
        setSelectedSeat(null);
        setShowQuickNoShow(false);
        await Promise.all([
          loadPassengers(),
          loadSeats(selectedCoachId),
          loadTrainData(),
          loadRecommendations(),
          loadEvents(),
        ]);
      }
    } catch (err: any) {
      showToast(err.message || "Failed to record No-Show in database", "error");
    } finally {
      setIsActionLoading(false);
    }
  };

  // If still checking initial auth from localStorage
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-semibold">Initializing R3LAY Security Context...</p>
        </div>
      </div>
    );
  }

  // 1. If not authenticated, ALWAYS show Login Screen
  if (!currentUser) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  const pendingRecsCount = recommendations.filter((r) => r.status === "PENDING").length;
  const racCount = coaches.reduce((acc, c) => acc + (c.racCount || 0), 0);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans text-slate-100">
      {/* Toast Notification Banner */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-fadeIn">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl border text-xs font-semibold backdrop-blur-md ${
              toast.type === "success"
                ? "bg-emerald-950/90 text-emerald-200 border-emerald-500/50"
                : toast.type === "error"
                ? "bg-rose-950/90 text-rose-200 border-rose-500/50"
                : "bg-blue-950/90 text-blue-200 border-blue-500/50"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : toast.type === "error" ? (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-blue-400 shrink-0" />
            )}
            <span>{toast.message}</span>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="ml-2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Top Header */}
      <Header
        user={currentUser}
        train={train}
        onLogout={handleLogout}
        onRunOptimization={handleRunOptimization}
        isOptimizing={isOptimizing}
        onRefresh={refreshAll}
        isRefreshing={isRefreshing}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        onOpenAwsConfig={() => setShowAwsConfig(true)}
      />

      {/* Main Body with Sidebar + Tab Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          pendingRecsCount={pendingRecsCount}
          racCount={racCount}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        {/* Tab Content Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {activeTab === "dashboard" && (
            <DashboardView
              train={train}
              coaches={coaches}
              selectedCoachId={selectedCoachId}
              setSelectedCoachId={setSelectedCoachId}
              seats={coachSeats}
              recommendations={recommendations}
              events={events}
              onSelectSeat={(seat) => setSelectedSeat(seat)}
              onApproveRec={handleApproveRec}
              onRejectRec={(rec) => setRejectingRec(rec)}
              onRunOptimization={handleRunOptimization}
              isOptimizing={isOptimizing}
              onNavigate={(tab) => setActiveTab(tab)}
              onOpenQuickNoShow={() => setShowQuickNoShow(true)}
              onDownloadReport={(type) => window.open(`/api/reports?type=${type}&format=csv`, "_blank")}
            />
          )}

          {activeTab === "train-overview" && (
            <TrainOverviewView
              train={train}
              coaches={coaches}
              onSelectCoach={(cNum) => setSelectedCoachId(cNum)}
              onNavigate={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === "coach-view" && (
            <CoachMapView
              coaches={coaches}
              selectedCoachId={selectedCoachId}
              setSelectedCoachId={setSelectedCoachId}
              seats={coachSeats}
              onSelectSeat={(seat) => setSelectedSeat(seat)}
              isLoadingSeats={isLoadingSeats}
              onRefreshSeats={() => loadSeats(selectedCoachId)}
            />
          )}

          {activeTab === "passengers" && (
            <PassengersView
              passengers={passengers}
              onMarkNoShow={(pax) =>
                handleMarkNoShow({
                  passengerId: pax.id,
                  pnr: pax.pnr,
                  coachNumber: pax.coachNumber,
                  berthNumber: pax.berthNumber,
                })
              }
              onRefresh={() => loadPassengers(passengerSearchQuery)}
              isLoading={isLoadingPassengers}
              onSearchChange={(q) => {
                setPassengerSearchQuery(q);
                loadPassengers(q);
              }}
              searchQuery={passengerSearchQuery}
            />
          )}

          {activeTab === "recommendations" && (
            <RecommendationsView
              recommendations={recommendations}
              onApprove={handleApproveRec}
              onReject={(rec) => setRejectingRec(rec)}
              onRunOptimization={handleRunOptimization}
              isOptimizing={isOptimizing}
              onRefresh={loadRecommendations}
              isLoading={isLoadingRecs}
              approvingId={approvingId}
            />
          )}

          {activeTab === "live-events" && (
            <LiveEventsView
              events={events}
              onRefresh={loadEvents}
              isLoading={isRefreshing}
              onEventCreated={loadEvents}
            />
          )}

          {activeTab === "analytics" && <AnalyticsView />}

          {activeTab === "assistant" && <AssistantView />}

          {activeTab === "reports" && <ReportsView />}

          {activeTab === "settings" && <SettingsView />}
        </main>
      </div>

      {/* Modals */}
      {selectedSeat && (
        <SeatModal
          seat={selectedSeat}
          onClose={() => setSelectedSeat(null)}
          onMarkNoShow={(seat, reason) =>
            handleMarkNoShow({
              coachNumber: seat.coachId?.replace("12951-", ""),
              berthNumber: seat.berthNumber,
              pnr: seat.passengerId,
              reason,
            })
          }
          isActionLoading={isActionLoading}
        />
      )}

      {rejectingRec && (
        <RejectReasonModal
          recommendation={rejectingRec}
          onClose={() => setRejectingRec(null)}
          onConfirmReject={handleConfirmReject}
          isRejecting={isRejecting}
        />
      )}

      {showQuickNoShow && (
        <QuickNoShowModal
          passengers={passengers}
          onClose={() => setShowQuickNoShow(false)}
          onSubmitNoShow={(params) => handleMarkNoShow(params)}
          isLoading={isActionLoading}
        />
      )}

      {showAwsConfig && (
        <AwsConfigModal onClose={() => setShowAwsConfig(false)} />
      )}
    </div>
  );
}
