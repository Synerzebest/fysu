import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import ThemeToggle from "@/components/ThemeToggle"

type Paragraph = {
  id: string
  content: string
  order_index: number
}

type Section = {
  id: string
  title: string
  order_index: number
  privacy_policy_paragraphs: Paragraph[]
}

async function getPrivacyPolicy(): Promise<Section[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/privacy-policy`, {
    cache: "no-store"
  })

  if (!res.ok) return []

  const data = await res.json()

  return data || []
}

export default async function Page() {
  const sections = await getPrivacyPolicy()

  return (
    <div className="bg-background text-foreground">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-24">
        <h1 className="text-4xl font-semibold mb-16">
          Privacy Policy
        </h1>

        <div className="space-y-16">
          {sections.map((section) => (
            <section key={section.id} className="space-y-6">
              
              <h2 className="text-2xl font-medium">
                {section.title}
              </h2>

              <div className="space-y-5 leading-relaxed">
                {section.privacy_policy_paragraphs
                  ?.sort((a, b) => a.order_index - b.order_index)
                  .map((paragraph) => (
                    <p key={paragraph.id}>
                      {paragraph.content}
                    </p>
                  ))}
              </div>

            </section>
          ))}
        </div>
      </main>

      <ThemeToggle />

      <Footer />
    </div>
  )
}