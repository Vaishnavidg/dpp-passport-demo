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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { writeContract } from "@wagmi/core";
import ClaimTopicsABI from "../../../contracts-abi-files/ClaimTopicsABI.json";
import { useContractRead } from "wagmi";

const Admin = "0x35C6e706EE23CD898b2C15fEB20f0fE726E734D2";
const ClaimTopicAddress = "0x7697208833D220C5657B3B52D1f448bEdE084948";

interface ClaimTopic {
  id: number;
  name: string;
  description: string;
}

export function ClaimTopicsTab() {
  const [newTopic, setNewTopic] = useState({
    id: "",
    name: "",
    description: "",
  });
  const { toast } = useToast();

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

  const handleAddTopic = async () => {
    if (!newTopic.id || !newTopic.name) {
      toast({
        title: "Missing Information",
        description: "Please provide both topic ID and name",
        variant: "destructive",
      });
      return;
    }
    const result = await writeContract({
      address: ClaimTopicAddress,
      abi: ClaimTopicsABI,
      functionName: "addClaimTopic",
      args:
        newTopic && ClaimTopicAddress
          ? [newTopic.id, newTopic.name, newTopic.description]
          : undefined,
      enabled: !!ClaimTopicAddress && newTopic,
    });
    if (result) {
      console.log("Claim Topic Added:", result);
      toast({
        title: "Claim Topic Added",
        description: `Topic "${newTopic.name}" has been registered`,
        variant: "default",
      });
    } else {
      toast({
        title: "Error",
        description: "Transaction not ready. Please try again.",
        variant: "destructive",
      });
    }
    setNewTopic({ id: "", name: "", description: "" });
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Claim Topic
          </CardTitle>
          <CardDescription>
            Register new claim topics for identity verification
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/10 border border-primary/20">
            <Info className="h-4 w-4 text-primary mt-0.5" />
            <p className="text-sm text-muted-foreground">
              Claim topics define the types of verification required. Common
              topics include KYC (1), AML (2), and custom business logic.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <Label htmlFor="topic-id">Topic ID</Label>
              <Input
                id="topic-id"
                type="number"
                placeholder="e.g., 1 for KYC"
                value={newTopic.id}
                onChange={(e) =>
                  setNewTopic({ ...newTopic, id: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="topic-name">Topic Name</Label>
              <Input
                id="topic-name"
                placeholder="e.g., KYC Verification"
                value={newTopic.name}
                onChange={(e) =>
                  setNewTopic({ ...newTopic, name: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="topic-description">Description</Label>
              <Textarea
                id="topic-description"
                placeholder="Describe the verification requirements..."
                value={newTopic.description}
                onChange={(e) =>
                  setNewTopic({ ...newTopic, description: e.target.value })
                }
              />
            </div>

            <Button
              onClick={handleAddTopic}
              className="w-full"
              variant="default"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Topic
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Registered Topics
          </CardTitle>
          <CardDescription>
            Active claim topics in the compliance framework
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topics.map((topic) => (
              <div
                key={topic.id}
                className="p-4 rounded-lg border border-border bg-secondary/30 hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline">ID: {topic.id}</Badge>
                      <h4 className="font-medium">{topic.name}</h4>
                    </div>
                    {topic.description && (
                      <p className="text-sm text-muted-foreground">
                        {topic.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {topics.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No claim topics registered yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
