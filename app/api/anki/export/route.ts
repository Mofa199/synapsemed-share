import { NextRequest, NextResponse } from 'next/server'

interface AnkiCard {
  front: string
  back: string
  tags?: string[]
}

// Generates an Anki-compatible TSV/Text format or JSON deck
export async function POST(request: NextRequest) {
  try {
    const { title, cards, category }: { title: string; cards: AnkiCard[]; category?: string } = await request.json()

    if (!cards || cards.length === 0) {
      return NextResponse.json({ error: "No cards provided" }, { status: 400 })
    }

    // Convert to Anki standard tab-delimited text with metadata headers
    let ankiTsv = `#separator:tab\n#html:true\n#tags column:3\n#deck:${title || 'SynapseMed Study Deck'}\n`
    
    cards.forEach((c) => {
      const frontSanitized = c.front.replace(/\t/g, ' ').replace(/\n/g, '<br>')
      const backSanitized = c.back.replace(/\t/g, ' ').replace(/\n/g, '<br>')
      const tagStr = (c.tags || [category || 'SynapseMed']).join(' ')
      ankiTsv += `${frontSanitized}\t${backSanitized}\t${tagStr}\n`
    })

    return new NextResponse(ankiTsv, {
      status: 200,
      headers: {
        'Content-Type': 'text/tab-separated-values; charset=utf-8',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(title || 'SynapseMed_Deck')}.txt"`,
      }
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate Anki export" }, { status: 500 })
  }
}
