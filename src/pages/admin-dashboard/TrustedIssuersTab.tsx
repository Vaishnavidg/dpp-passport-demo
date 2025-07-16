/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Users, Info, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MOCK_DATA } from "@/lib/config";
import { writeContract } from "@wagmi/core";
import TrustedIssuersABI from "../../../contracts-abi-files/TrustedIssuersABI.json";
import { useContractRead } from "wagmi";
import ClaimTopicsABI from "../../../contracts-abi-files/ClaimTopicsABI.json";

interface TrustedIssuer {
  address: string;
  name: string;
  topics: string[];
}
const TrustedIssuersRegistryAddress =
  "0xFAF9C47067D436ca7480bd7C3E2a85b53aC0c8E5";
const ClaimTopicAddress = "0x7697208833D220C5657B3B52D1f448bEdE084948";

export function TrustedIssuersTab() {
  const { data, isLoading, isError } = useContractRead({
    address: ClaimTopicAddress,
    abi: ClaimTopicsABI,
    functionName: "getClaimTopicsWithNamesAndDescription",
    watch: true,
  });
  const topics = useMemo(() => {
    if (!data) return [];
    const [ids, names, descriptions] = data as [bigint[], string[], string[]];

    return ids.map((id, index) => ({
      id: id.toString(),
      name: names[index],
      description: descriptions[index],
    }));
  }, [data]);

  const { data: issuers } = useContractRead({
    address: TrustedIssuersRegistryAddress,
    abi: TrustedIssuersABI,
    functionName: "getAllIssuersDetails",
    watch: true,
  });
  const trustedIssuers: TrustedIssuer[] = useMemo(() => {
    if (!issuers) return [];

    const [addresses, flatTopics, names] = issuers as [
      string[],
      bigint[],
      string[]
    ];

    return addresses.map((address, index) => {
      // If topics are flat, then we assume 1:1 mapping → each issuer has one topic
      const topicId = flatTopics?.[index]?.toString() ?? ""; // safe fallback
      return {
        address: address.toString(),
        name: names[index],
        topics: topicId ? [topicId] : [],
      };
    });
  }, [issuers]);

  console.log(trustedIssuers);

  const [newIssuer, setNewIssuer] = useState({
    address: "",
    name: "",
    topics: [] as string[],
  });
  const { toast } = useToast();

  const handleTopicChange = (topicId: string, checked: boolean) => {
    if (checked) {
      setNewIssuer({ ...newIssuer, topics: [...newIssuer.topics, topicId] });
    } else {
      setNewIssuer({
        ...newIssuer,
        topics: newIssuer.topics.filter((id) => id !== topicId),
      });
    }
  };

  const handleAddIssuer = async () => {
    if (!newIssuer.address || !newIssuer.name) {
      toast({
        title: "Missing Information",
        description: "Please provide both issuer address and name",
        variant: "destructive",
      });
      return;
    }
    if (newIssuer.topics.length === 0) {
      toast({
        title: "No Topics Selected",
        description: "Please select at least one claim topic",
        variant: "destructive",
      });
      return;
    }

    try {
      const topicIds = newIssuer.topics.map((id) => BigInt(id));
      const result = await writeContract({
        address: TrustedIssuersRegistryAddress,
        abi: TrustedIssuersABI,
        functionName: "addTrustedIssuer",
        args: [newIssuer.address, newIssuer.name, topicIds],
      });

      console.log("Trusted Issuers Added successfully", result.hash);
      toast({
        title: "Trusted Issuer Added",
        description: `Issuer "${newIssuer.name}" has been registered`,
        variant: "default",
      });
      setNewIssuer({ address: "", name: "", topics: [] });
    } catch (err: any) {
      console.error("Error adding issuer:", err);
      toast({
        title: "Transaction Failed",
        description: err.shortMessage || err.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Trusted Issuer
          </CardTitle>
          <CardDescription>
            Register trusted claim issuers for the compliance framework
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/10 border border-primary/20">
            <Info className="h-4 w-4 text-primary mt-0.5" />
            <p className="text-sm text-muted-foreground">
              Trusted issuers are authorized to provide claims for specific
              topics. Only claims from trusted issuers are valid for compliance.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <Label htmlFor="issuer-address">Issuer Address</Label>
              <Input
                id="issuer-address"
                placeholder="0x..."
                value={newIssuer.address}
                onChange={(e) =>
                  setNewIssuer({ ...newIssuer, address: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="issuer-name">Issuer Name</Label>
              <Input
                id="issuer-name"
                placeholder="e.g., KYC Provider Inc"
                value={newIssuer.name}
                onChange={(e) =>
                  setNewIssuer({ ...newIssuer, name: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Authorized Claim Topics</Label>
              <div className="space-y-2 mt-2">
                {topics.map((topic) => (
                  <div key={topic.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`topic-${topic.id}`}
                      checked={newIssuer.topics.includes(topic.id)}
                      onCheckedChange={(checked) =>
                        handleTopicChange(topic.id, checked as boolean)
                      }
                    />
                    <Label htmlFor={`topic-${topic.id}`} className="text-sm">
                      {topic.name} (ID: {topic.id})
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Button
              onClick={handleAddIssuer}
              className="w-full"
              variant="default"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Trusted Issuer
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Trusted Issuers
          </CardTitle>
          <CardDescription>Registered trusted claim issuers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {trustedIssuers.map((issuer, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border border-border bg-secondary/30 hover:bg-secondary/50 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{issuer.name}</h4>
                    <Badge variant="outline" className="text-xs">
                      {issuer.address}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {issuer.topics.map((topicId) => {
                      const topic = topics.find((t) => t.id === topicId);
                      return (
                        <Badge
                          key={topicId}
                          className="text-xs bg-success/70 text-success-foreground"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {topic?.name || `Topic ${topicId}`}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}

            {trustedIssuers.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No trusted issuers registered yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
