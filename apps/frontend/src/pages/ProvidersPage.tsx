import { useEffect, useState } from "react"

import { PageShell } from "@/components/dashboard/page-shell"
import { StateMessage } from "@/components/dashboard/state-message"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { apiClient } from "../api/client"
import { ProvidersModels } from "../types/api"

export default function ProvidersPage() {
  const [catalog, setCatalog] = useState<ProvidersModels | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const providersData = await apiClient.getProvidersModels()
        setCatalog(providersData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load providers")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <PageShell
        title="Providers"
        description="Inspect currently connected AI and TTS providers."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-56 rounded-xl" />
          <Skeleton className="h-56 rounded-xl" />
        </div>
      </PageShell>
    )
  }

  if (error) {
    return (
      <PageShell title="Providers" description="Inspect currently connected AI and TTS providers.">
        <StateMessage variant="destructive" title="Provider fetch failed" message={error} />
      </PageShell>
    )
  }

  return (
    <PageShell
      title="Providers"
      description="Inspect backend-supported AI tools, providers, and models."
    >
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>AI Tools Catalog</CardTitle>
            <CardDescription className="text-xs">
              {catalog?.version ? `Catalog v${catalog.version}` : "Catalog metadata unavailable"}
              {catalog?.generatedAt ? ` • Generated ${new Date(catalog.generatedAt).toLocaleString()}` : ""}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {!catalog?.tools?.length ? (
              <StateMessage message="No providers configured yet." />
            ) : (
              catalog.tools.map((tool) => (
                <div key={tool.id} className="rounded-xl border p-4">
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium">{tool.displayName}</p>
                      <p className="text-xs text-muted-foreground">{tool.description}</p>
                    </div>
                    <Badge variant="secondary">
                      {tool.providers.length} provider{tool.providers.length === 1 ? "" : "s"}
                    </Badge>
                  </div>

                  <div className="grid gap-2">
                    {tool.providers.map((provider) => (
                      <div key={`${tool.id}-${provider.name}`} className="rounded-lg border p-3">
                        <div className="mb-2 flex items-center justify-between gap-2">
                          <div>
                            <p className="text-sm font-medium">{provider.displayName}</p>
                            {provider.description ? (
                              <p className="text-xs text-muted-foreground">{provider.description}</p>
                            ) : null}
                          </div>
                          {provider.isDefault ? <Badge variant="secondary">Default</Badge> : null}
                        </div>

                        {provider.models.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {provider.models.map((model) => (
                              <Badge key={model.id} variant={model.isDefault ? "secondary" : "outline"}>
                                {model.displayName}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-muted-foreground">No model metadata available.</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Default Runtime Selection</CardTitle>
          </CardHeader>
          <CardContent>
            {!catalog?.defaults ? (
              <StateMessage message="No defaults configured." />
            ) : (
              <div className="grid gap-2 text-sm">
                <div className="flex items-center justify-between rounded-lg border px-3 py-2">
                  <span className="text-muted-foreground">Script</span>
                  <span className="font-medium">
                    {catalog.defaults.script?.provider || "-"} / {catalog.defaults.script?.model || "-"}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg border px-3 py-2">
                  <span className="text-muted-foreground">Image</span>
                  <span className="font-medium">
                    {catalog.defaults.image?.provider || "-"} / {catalog.defaults.image?.model || "-"}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg border px-3 py-2">
                  <span className="text-muted-foreground">TTS</span>
                  <span className="font-medium">
                    {catalog.defaults.tts?.provider || "-"} / {catalog.defaults.tts?.model || "-"}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageShell>
  )
}
