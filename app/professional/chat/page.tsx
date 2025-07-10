import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, PaperclipIcon, ImageIcon } from "lucide-react"

export default function ProfessionalChat() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Chat with Supervisor</h2>
        <p className="text-muted-foreground">Communicate directly with your supervisor</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 order-2 md:order-1">
          <CardHeader>
            <CardTitle>Conversations</CardTitle>
            <CardDescription>Your recent conversations</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-300px)] md:h-[calc(100vh-300px)]">
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-3 rounded-lg bg-primary/5 border">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=40&width=40&query=supervisor" alt="Supervisor" />
                    <AvatarFallback>MS</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">Mark Smith</p>
                    <p className="text-xs text-muted-foreground">Supervisor - Team A</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-muted-foreground">Today</span>
                    <span className="w-2 h-2 bg-primary rounded-full mt-1"></span>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=40&width=40&query=coordinator" alt="Coordinator" />
                    <AvatarFallback>RC</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">Rachel Cooper</p>
                    <p className="text-xs text-muted-foreground">General Coordinator</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-muted-foreground">Yesterday</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=40&width=40&query=team" alt="Team" />
                    <AvatarFallback>TA</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">Team A</p>
                    <p className="text-xs text-muted-foreground">Group (5 members)</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-muted-foreground">05/22</span>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 order-1 md:order-2">
          <CardHeader className="flex flex-row items-center">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=40&width=40&query=supervisor" alt="Supervisor" />
                <AvatarFallback>MS</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>Mark Smith</CardTitle>
                <CardDescription>Supervisor - Team A</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[300px] md:h-[calc(100vh-350px)] px-6">
              <div className="space-y-4 py-4">
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32&query=supervisor" alt="Supervisor" />
                    <AvatarFallback>MS</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Mark Smith</span>
                      <span className="text-xs text-muted-foreground">09:15</span>
                    </div>
                    <div className="bg-muted p-3 rounded-lg rounded-tl-none max-w-[80%]">
                      <p className="text-sm">
                        Good morning! How's the service at the Flores residence? Did you find the location without any
                        issues?
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 justify-end">
                  <div className="flex flex-col gap-1 items-end">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">09:22</span>
                      <span className="text-sm font-medium">You</span>
                    </div>
                    <div className="bg-primary text-primary-foreground p-3 rounded-lg rounded-tr-none max-w-[80%]">
                      <p className="text-sm">
                        Good morning, Mark! Yes, I arrived on time and have already started the service. The client left
                        the keys with the doorman as arranged.
                      </p>
                    </div>
                  </div>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32&query=professional" alt="You" />
                    <AvatarFallback>YO</AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32&query=supervisor" alt="Supervisor" />
                    <AvatarFallback>MS</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Mark Smith</span>
                      <span className="text-xs text-muted-foreground">09:25</span>
                    </div>
                    <div className="bg-muted p-3 rounded-lg rounded-tl-none max-w-[80%]">
                      <p className="text-sm">
                        Great! Remember that this client requested special attention to the bathrooms and kitchen. Let
                        me know if you encounter any issues.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 justify-end">
                  <div className="flex flex-col gap-1 items-end">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">09:30</span>
                      <span className="text-sm font-medium">You</span>
                    </div>
                    <div className="bg-primary text-primary-foreground p-3 rounded-lg rounded-tr-none max-w-[80%]">
                      <p className="text-sm">
                        Will do! I'm following all the instructions. I should finish within the scheduled time.
                      </p>
                    </div>
                  </div>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32&query=professional" alt="You" />
                    <AvatarFallback>YO</AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32&query=supervisor" alt="Supervisor" />
                    <AvatarFallback>MS</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Mark Smith</span>
                      <span className="text-xs text-muted-foreground">09:32</span>
                    </div>
                    <div className="bg-muted p-3 rounded-lg rounded-tl-none max-w-[80%]">
                      <p className="text-sm">
                        Perfect! Please send before/after photos to include in the report. Good work!
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 justify-end">
                  <div className="flex flex-col gap-1 items-end">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">09:35</span>
                      <span className="text-sm font-medium">You</span>
                    </div>
                    <div className="bg-primary text-primary-foreground p-3 rounded-lg rounded-tr-none max-w-[80%]">
                      <p className="text-sm">I'll send them! Thanks for the support.</p>
                    </div>
                  </div>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32&query=professional" alt="You" />
                    <AvatarFallback>YO</AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </ScrollArea>

            <div className="p-4 border-t">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="rounded-full">
                  <PaperclipIcon className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <ImageIcon className="h-4 w-4" />
                </Button>
                <Input placeholder="Type your message..." className="flex-1" />
                <Button size="icon" className="rounded-full">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
