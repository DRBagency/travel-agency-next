import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const clienteId = cookieStore.get("cliente_id")?.value;
  if (!clienteId) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");
  const page = searchParams.get("page") || "1";

  if (!query || query.trim().length === 0) {
    return NextResponse.json({ error: "Query requerida" }, { status: 400 });
  }

  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) {
    return NextResponse.json(
      { error: "Unsplash no configurado. Agrega UNSPLASH_ACCESS_KEY en las variables de entorno." },
      { status: 500 }
    );
  }

  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=12&page=${page}`;

  const res = await fetch(url, {
    headers: { Authorization: `Client-ID ${accessKey}` },
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "Error al buscar en Unsplash" },
      { status: res.status }
    );
  }

  const data = await res.json();

  const photos = data.results.map(
    (photo: {
      id: string;
      urls: { small: string; regular: string; full: string };
      alt_description: string | null;
      user: { name: string };
    }) => ({
      id: photo.id,
      url_small: photo.urls.small,
      url_regular: photo.urls.regular,
      url_full: photo.urls.full,
      alt: photo.alt_description || "",
      author: photo.user.name,
    })
  );

  return NextResponse.json({ photos, total_pages: data.total_pages });
}
