import { Mideas } from "@/app/home/page";
import { Community } from "@/components/community";
import { Header } from "@/components/header";
import { getUser } from "@/contexts/auth";
import { User } from "@/contexts/profile";
import { api } from "@/lib/api";
import { SlidersHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Params {
  params: {
    query: string;
  };
}

export default async function Search({ params: { query } }: Params) {
  const response = await api.get("/mideas/search", {
    params: {
      query,
    },
  });

  const { mideas, users } = response.data;

  const mideasFetched: Mideas[] = mideas;

  const usersFetched: User[] = users;

  return (
    <>
      <Header userId={getUser().sub} />

      <div className="flex mt-6">
        <section className="flex-1">
          <div className="flex space-x-4 my-2">
            <SlidersHorizontal />
            <p>Filtrar</p>
          </div>
          <div className="border-b my-4"></div>
          {usersFetched.length === 0 ? (
            <div className="flex flex-1 items-center justify-center p-16">
              <p className="w-[360px] text-center leading-relaxed">
                Nenhum usuário encontrado
              </p>
            </div>
          ) : (
            <></>
          )}
          {usersFetched.map((user) => {
            return (
              <div className="flex" key={user.id}>
                <div className="w-[140]">
                  <figure className="w-16 h-16 rounded-full overflow-hidden">
                    <Image
                      src={`${api.getUri()}/${user.avatarUrl}`}
                      alt="Profile Avatar"
                      width={150}
                      height={32}
                      className="bg-cover object-contain"
                    />
                  </figure>
                </div>

                <div className="mx-12">
                  <p className="my-2">{user.name}</p>
                  <p>{user.midea.length} Mideas</p>
                  <p>{user.description}</p>
                </div>
              </div>
            );
          })}

          <div className="border-b my-4"></div>
          <div className="my-2">Resultados</div>

          <div className="flex flex-col gap-6 content-around">
            {mideasFetched.length === 0 ? (
              <div className="flex flex-1 items-center justify-center p-16">
                <p className="w-[360px] text-center leading-relaxed">
                  Nenhum mídea encontrado
                </p>
              </div>
            ) : (
              <></>
            )}
            {mideasFetched.map((midea) => {
              return (
                <div key={midea.id} className="w-64">
                  <Link href={`/midea/${midea.id}`}>
                    <div className={`h-32 relative overflow-hidden`}>
                      <Image
                        src={`${api.getUri()}/${midea.cover_url}`}
                        alt=""
                        fill
                      />
                      <span className="bg-zinc-800 m-2 absolute bottom-0 left-0">
                        45:34
                      </span>
                    </div>
                  </Link>

                  <div className="flex flex-col">
                    <span className="font-normal mt-1">{midea.name}</span>
                    <div className="flex place-content-between">
                      <Link
                        href={`/profile/${midea.user.id}`}
                        className="font-light	text-sm"
                      >
                        {midea.user.name}
                      </Link>
                      <span className="font-light text-sm	">{`${new Date(
                        midea.created_at
                      ).toDateString()}`}</span>
                    </div>
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
