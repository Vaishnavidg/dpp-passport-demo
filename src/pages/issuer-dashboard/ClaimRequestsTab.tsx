import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  User,
  Shield,
  FileCheck,
  MapPin,
  Building,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ClaimRequest {
  id: string;
  requesterAddress: string;
  claimType: string;
  message?: string;
  timestamp: string;
  status: "pending" | "approved" | "rejected";
}

const claimTypeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  kyc: User,
  aml: Shield,
  "proof-of-residency": MapPin,
  "business-license": Building,
  "identity-document": FileCheck,
};

const claimTypeNames: Record<string, string> = {
  kyc: "KYC Verification",
  aml: "AML Compliance",
  "proof-of-residency": "Proof of Residency",
  "business-license": "Business License",
  "identity-document": "Identity Document",
};

// Mock data for demonstration
const mockRequests: ClaimRequest[] = [
  {
    id: "1",
    requesterAddress: "0x1234567890123456789012345678901234567890",
    claimType: "kyc",
    message: "Requesting KYC verification for token access",
    timestamp: "2024-01-16T14:30:00Z",
    status: "pending",
  },
  {
    id: "2",
    requesterAddress: "0x9876543210987654321098765432109876543210",
    claimType: "aml",
    timestamp: "2024-01-16T12:15:00Z",
    status: "pending",
  },
  {
    id: "3",
    requesterAddress: "0x5555666677778888999900001111222233334444",
    claimType: "proof-of-residency",
    message: "Need address verification for compliance requirements",
    timestamp: "2024-01-15T16:45:00Z",
    status: "approved",
  },
];

export function ClaimRequestsTab() {
  const [requests, setRequests] = useState<ClaimRequest[]>(mockRequests);
  const [selectedRequest, setSelectedRequest] = useState<ClaimRequest | null>(null);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const handleAction = async (request: ClaimRequest, action: "approve" | "reject") => {
    setSelectedRequest(request);
    setActionType(action);
  };

  const confirmAction = async () => {
    if (!selectedRequest || !actionType) return;

    setIsProcessing(true);
    
    try {
      // Simulate smart contract interaction
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Update the request status
      setRequests(prev => 
        prev.map(req => 
          req.id === selectedRequest.id 
            ? { ...req, status: actionType === "approve" ? "approved" : "rejected" }
            : req
        )
      );

      toast({
        title: actionType === "approve" ? "Claim Issued Successfully" : "Request Rejected",
        description: actionType === "approve" 
          ? "The claim has been issued to the user's identity contract."
          : "The claim request has been rejected.",
      });

      setSelectedRequest(null);
      setActionType(null);
    } catch (error) {
      toast({
        title: "Action Failed",
        description: "Failed to process the request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: ClaimRequest["status"]) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="text-warning border-warning">Pending</Badge>;
      case "approved":
        return <Badge variant="outline" className="text-success border-success">Approved</Badge>;
      case "rejected":
        return <Badge variant="outline" className="text-destructive border-destructive">Rejected</Badge>;
      default:
        return null;
    }
  };

  const pendingRequests = requests.filter(req => req.status === "pending");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Incoming Claim Requests
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Review and process identity verification requests from users
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          {requests.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Requests Yet</h3>
              <p className="text-muted-foreground">
                Claim requests from users will appear here for your review.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingRequests.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-warning" />
                    Pending Requests ({pendingRequests.length})
                  </h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Requester</TableHead>
                        <TableHead>Claim Type</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>Requested</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingRequests.map((request) => {
                        const ClaimIcon = claimTypeIcons[request.claimType] || Shield;
                        
                        return (
                          <TableRow key={request.id}>
                            <TableCell className="font-mono text-sm">
                              {request.requesterAddress.slice(0, 6)}...{request.requesterAddress.slice(-4)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <ClaimIcon className="h-4 w-4 text-primary" />
                                <span className="text-sm">
                                  {claimTypeNames[request.claimType] || request.claimType}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="max-w-xs">
                              <div className="truncate text-sm text-muted-foreground">
                                {request.message || "No message provided"}
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {formatTimestamp(request.timestamp)}
                            </TableCell>
                            <TableCell className="text-right space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleAction(request, "approve")}
                                className="gap-1"
                              >
                                <CheckCircle className="h-3 w-3" />
                                Issue
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleAction(request, "reject")}
                                className="gap-1 text-destructive hover:text-destructive"
                              >
                                <XCircle className="h-3 w-3" />
                                Reject
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}

              {requests.filter(req => req.status !== "pending").length > 0 && (
                <div>
                  <h4 className="font-medium mb-3">Processed Requests</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Requester</TableHead>
                        <TableHead>Claim Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Processed</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {requests.filter(req => req.status !== "pending").map((request) => {
                        const ClaimIcon = claimTypeIcons[request.claimType] || Shield;
                        
                        return (
                          <TableRow key={request.id}>
                            <TableCell className="font-mono text-sm">
                              {request.requesterAddress.slice(0, 6)}...{request.requesterAddress.slice(-4)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <ClaimIcon className="h-4 w-4 text-primary" />
                                <span className="text-sm">
                                  {claimTypeNames[request.claimType] || request.claimType}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(request.status)}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {formatTimestamp(request.timestamp)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog 
        open={!!selectedRequest && !!actionType} 
        onOpenChange={() => {
          setSelectedRequest(null);
          setActionType(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {actionType === "approve" ? (
                <CheckCircle className="h-5 w-5 text-success" />
              ) : (
                <XCircle className="h-5 w-5 text-destructive" />
              )}
              {actionType === "approve" ? "Issue Claim" : "Reject Request"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "approve" 
                ? "Are you sure you want to issue this claim to the user's identity contract?"
                : "Are you sure you want to reject this claim request?"
              }
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-3 py-4">
              <div>
                <p className="text-sm font-medium">Requester</p>
                <p className="text-sm text-muted-foreground font-mono">
                  {selectedRequest.requesterAddress}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Claim Type</p>
                <p className="text-sm text-muted-foreground">
                  {claimTypeNames[selectedRequest.claimType] || selectedRequest.claimType}
                </p>
              </div>
              {selectedRequest.message && (
                <div>
                  <p className="text-sm font-medium">Message</p>
                  <p className="text-sm text-muted-foreground">{selectedRequest.message}</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedRequest(null);
                setActionType(null);
              }}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmAction}
              disabled={isProcessing}
              variant={actionType === "approve" ? "default" : "destructive"}
              className="gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Processing...
                </>
              ) : (
                <>
                  {actionType === "approve" ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  {actionType === "approve" ? "Issue Claim" : "Reject Request"}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}