import { useState } from "react";
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
import { MOCK_DATA, EDUCATIONAL_MESSAGES } from "../../lib/config";

interface ClaimTopic {
  id: number;
  name: string;
  description: string;
}

export function ClaimTopicsTab() {
  const [claimTopics, setClaimTopics] = useState<ClaimTopic[]>(
    MOCK_DATA.claimTopics
  );
  const [newTopic, setNewTopic] = useState({
    id: "",
    name: "",
    description: "",
  });
  const { toast } = useToast();

  const handleAddTopic = () => {
    if (!newTopic.id || !newTopic.name) {
      toast({
        title: "Missing Information",
        description: "Please provide both topic ID and name",
        variant: "destructive",
      });
      return;
    }

    const topic: ClaimTopic = {
      id: parseInt(newTopic.id),
      name: newTopic.name,
      description: newTopic.description,
    };

    setClaimTopics([...claimTopics, topic]);
    setNewTopic({ id: "", name: "", description: "" });

    toast({
      title: "Claim Topic Added",
      description: `Topic "${topic.name}" has been registered`,
      variant: "default",
    });
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
            {claimTopics.map((topic) => (
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

            {claimTopics.length === 0 && (
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
