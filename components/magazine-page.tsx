"use client"

import { Button } from "@/components/ui/button"
import { article } from "@/data/articles" // Assuming article is imported from a data source
;<Button
  onClick={() => (window.location.href = `/magazine/${article.id}`)}
  className="w-full bg-[#213874] hover:bg-[#1a6ac3]"
>
  Read Article
</Button>
