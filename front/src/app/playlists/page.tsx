import { Community } from "@/components/community";
import { Header } from "@/components/header";
import { getUser } from "@/contexts/auth";
import { api } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { Mideas } from "../home/page";
import { ListVideo } from "lucide-react";
import { CreatePlaylistModal } from "@/components/createPlaylistModal";

export interface Playlists {
  id: string;
  name: string;
  description: string;
  visibility: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  mideas: Mideas[];
}

export default async function Playlists() {
  const loggedUser = getUser().sub;
  const response = await api.get(`/playlists/by/${loggedUser}`);

  const playlists = response.data as Playlists[];

  return (
    <>
      <Header userId={loggedUser} />

      <div className="flex mt-6">
        <section className="flex-1">
          <div className="flex my-2 place-content-between">
            <span>Playlists</span>
            <CreatePlaylistModal userId={loggedUser} />
          </div>

          <div className="flex flex-col gap-6 content-around">
            {playlists.length === 0 ? (
              <div className="flex flex-1 items-center justify-center p-16">
                <p className="w-[360px] text-center leading-relaxed">
                  Usuário sem playlists
                </p>
              </div>
            ) : (
              <></>
            )}
            {playlists.map((playlist) => {
              return (
                <div key={playlist.id} className="w-64">
                  <Link href={`/playlists/${playlist.id}`}>
                    <div className={`h-32 relative overflow-hidden bg-white`}>
                      <Image
                        src={
                          playlist.mideas.length === 0
                            ? `/playlist.png`
                            : `${api.getUri()}/${playlist.mideas[0].cover_url}`
                        }
                        alt=""
                        fill
                      />
                      <div className="flex bg-zinc-800 m-2 absolute bottom-0 left-0">
                        <ListVideo />
                        <span className="text-white ml-1">
                          {" "}
                          {playlist.mideas.length}
                        </span>
                      </div>
                    </div>
                  </Link>

                  <div className="flex place-content-between">
                    <span className="font-normal mt-1">{playlist.name}</span>
                    <span className="font-light text-sm	mt-1">{`${new Date(
                      playlist.created_at
                    ).toDateString()}`}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
        <Community />
      </div>
    </>
  );
}
