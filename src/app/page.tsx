import WeddingFrames from "./components/WeddingFrames";

export default function Home() {
  return (
    <main>
      <WeddingFrames />

      <section className="h-screen flex items-center justify-center bg-white">
        <h1 className="text-5xl font-bold">
          Wedding Story
        </h1>
      </section>
    </main>
  );
}