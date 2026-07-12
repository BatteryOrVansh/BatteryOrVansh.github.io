import { supabase } from "@/lib/supabase/client";
import { Container } from "@/components/ui/Container";
import type { BioContent } from "@/types/database";

export const revalidate = 0;

async function getBioContent(): Promise<Record<string, string>> {
  const { data } = await supabase.from("bio_content").select("key, value");

  const map: Record<string, string> = {};
  (data as BioContent[] | null)?.forEach((row) => {
    if (row.value) map[row.key] = row.value;
  });
  return map;
}

function VisitorCounter() {
  // A tasteful wink at the 90s-web visitor counter, not literally broken UX.
  const seed = 108;
  return (
    <div className="inline-flex items-center gap-2 border-2 border-lime-400 bg-black px-3 py-1 font-mono text-lime-400">
      <span className="text-xs">VISITORS:</span>
      <span className="tracking-widest">{String(seed).padStart(6, "0")}</span>
    </div>
  );
}

export default async function BioPage() {
  const bio = await getBioContent();

  return (
    <main className="bio-90s min-h-screen py-24">
      <div className="overflow-hidden border-y-4 border-double border-black bg-black py-2">
        <div className="animate-marquee flex w-max gap-16 whitespace-nowrap text-sm font-bold text-[#ffcc00]">
          {Array.from({ length: 2 }).map((_, i) => (
            <span key={i}>
              ★ WELCOME TO VANSH DIXIT&apos;S HOMEPAGE ★ BEST VIEWED AT ANY RESOLUTION ★ THANKS
              FOR VISITING ★ SIGN THE GUESTBOOK ★
            </span>
          ))}
        </div>
      </div>

      <Container className="mt-10">
        <div className="win95-bevel-out">
          {/* Fake title bar, like the app window this whole page is cosplaying as */}
          <div className="flex items-center justify-between bg-[#000080] px-2 py-1">
            <span className="text-sm font-bold tracking-wide text-white">
              vansh_dixit_homepage.htm
            </span>
            <span className="text-xs text-white opacity-80">_ &#9633; X</span>
          </div>

          <div className="p-6">
            <table className="w-full border-collapse">
              <tbody>
                <tr>
                  <td className="w-40 p-3 align-top">
                    <div className="win95-bevel-in h-36 w-36 overflow-hidden p-1">
                      {bio.photo_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={bio.photo_url}
                          alt="Vansh Dixit"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-[#dcdcdc] text-xs text-[#555]">
                          photo.gif
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-3 align-top">
                    <h1 className="text-3xl font-bold text-[#800000]">Vansh Dixit</h1>
                    {bio.contact && (
                      <p className="mt-1 text-sm text-[#000080] underline">{bio.contact}</p>
                    )}
                    <div className="mt-3">
                      <VisitorCounter />
                    </div>
                    {bio.summary && (
                      <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#1a1a1a]">
                        {bio.summary}
                      </p>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>

            <hr className="my-6 border-t-2 border-dashed border-[#808080]" />

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            <section>
              <h2 className="inline-block bg-fuchsia-600 px-2 py-0.5 font-mono text-sm font-bold uppercase text-black">
                Education
              </h2>
              <pre className="mt-3 whitespace-pre-wrap font-mono text-sm text-[#c9c9d4]">
                {bio.education}
              </pre>
            </section>

            <section>
              <h2 className="inline-block bg-lime-400 px-2 py-0.5 font-mono text-sm font-bold uppercase text-black">
                Experience
              </h2>
              <pre className="mt-3 whitespace-pre-wrap font-mono text-sm text-[#c9c9d4]">
                {bio.experience}
              </pre>
            </section>

            <section>
              <h2 className="inline-block bg-cyan-400 px-2 py-0.5 font-mono text-sm font-bold uppercase text-black">
                Certifications
              </h2>
              <pre className="mt-3 whitespace-pre-wrap font-mono text-sm text-[#c9c9d4]">
                {bio.certifications}
              </pre>
            </section>

            <section>
              <h2 className="inline-block bg-yellow-300 px-2 py-0.5 font-mono text-sm font-bold uppercase text-black">
                Links
              </h2>
              <p className="mt-3 font-mono text-sm text-[#c9c9d4]">{bio.links}</p>
            </section>
          </div>
          </div>
        </div>

        <p className="mt-6 text-center font-mono text-xs text-[#555]">
          made with notepad.exe &amp; ambition — est. this century
        </p>
      </Container>
    </main>
  );
}
