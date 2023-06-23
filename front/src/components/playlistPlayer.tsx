"use client";
import { Playlists } from "@/app/playlists/page";
import { api, nextApi } from "@/lib/api";
import { Send, ThumbsDown, ThumbsUp } from "lucide-react";
import Image from "next/image";
import { KeyboardEvent, useState } from "react";
import { CopyToClipboard } from "./copyClipboard";
import { ListPlus } from "lucide-react";
import { ArrowDownToLine } from "lucide-react";
import { Playlist } from "./playlist";
import Link from "next/link";
import { UserPayload } from "@/contexts/auth";
import { ArrowDownWideNarrow } from "lucide-react";
import { Comments } from "@/app/home/page";

interface Props {
  playlist: Playlists;
  userLogged: UserPayload;
}

export function PlaylistPlayer({ playlist, userLogged }: Props) {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [list, setPlaylist] = useState<Playlists>(playlist);
  const [newMessage, setNewMessage] = useState("");
  const [comments, setComments] = useState<Comments[]>([
    ...list.mideas[currentVideo].comments,
  ]);

  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === "Enter") {
      addComment();
    }
  }

  function addComment() {
    api.post(`/mideas/${list.mideas[currentVideo].id}/comment`, {
      message: newMessage,
      user_id: userLogged.sub,
    });
    setNewMessage("");

    const comment = {
      user: userLogged,
      created_at: new Date(),
      message: newMessage,
      midea_id: list.mideas[currentVideo].id,
    } as unknown as Comments;

    setComments([comment, ...comments]);
  }

  function handlePreviousClick() {
    if (currentVideo !== 0) {
      setCurrentVideo(currentVideo - 1);
      setComments(list.mideas[currentVideo].comments);
    }
  }

  function handleNextClick() {
    if (currentVideo !== list.mideas.length - 1) {
      setCurrentVideo(currentVideo + 1);
      setComments(list.mideas[currentVideo].comments);
    }
  }

  const isMusic = list.mideas[currentVideo].type === "music";

  return (
    <div className="flex mt-6">
      <section className="flex-1">
        <div className={"flex flex-col"}>
          {isMusic && (
            <figure className="bg-cover h-96 relative overflow-hidden">
              <Image
                src={`${api.getUri()}/${list.mideas[currentVideo].cover_url}`}
                alt="Cover Da Mídea"
                width={900}
                height={160}
              />
            </figure>
          )}

          <video
            className={isMusic ? "h-12 my-6" : "h-96 my-6"}
            src={`${api.getUri()}/mideas/stream/${
              list.mideas[currentVideo].id
            }`}
            controls
            autoPlay
            width={900}
          ></video>
          <div className="flex place-content-between">
            <button onClick={handlePreviousClick}>Previous</button>
            <button onClick={handleNextClick} className="mr-7">
              Next
            </button>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-xl mt-1">
            {list.mideas[currentVideo].name}
          </span>
          <div className="flex content-between justify-between">
            <div>
              <p className="font-ligh text-sm inline-block">
                {new Date(list.mideas[currentVideo].created_at).toDateString()}
              </p>
            </div>
            <div className="flex space-x-4">
              <p className="flex items-center">
                <ThumbsUp width={16} height={16} className="mx-2" />
                200
              </p>
              <p className="flex items-center">
                <ThumbsDown width={16} height={16} className="mx-2" />
                20
              </p>
              <CopyToClipboard
                link={`${nextApi}/midea/${list.mideas[currentVideo].id}`}
              />
              <p className="flex items-center">
                <ListPlus width={16} height={16} className="mx-2" />
                Save
              </p>
              <p className="flex items-center">
                <ArrowDownToLine width={16} height={16} className="mx-2" />
                Download
              </p>
            </div>
          </div>
          <div className="mt-3">
            <p>{list.mideas[currentVideo].description}</p>
          </div>
          <div className="border-b border-m my-4"></div>
        </div>
        <div>
          <div className="flex items-center">
            <figure className="w-12 h-12 rounded-full overflow-hidden">
              <Image
                src={`${api.getUri()}/${
                  list.mideas[currentVideo].user.avatarUrl
                }`}
                alt="Profile Avatar"
                width={150}
                height={32}
                className="bg-cover object-contain"
              />
            </figure>
            <div className="mx-2">
              <Link href={`/profile/${list.mideas[currentVideo].user.id}`}>
                <div>
                  <span>{list.mideas[currentVideo].user.name}</span>
                </div>
              </Link>
            </div>
          </div>
          <div className="ml-14 my-3">
            {list.mideas[currentVideo].user.description}
          </div>
        </div>

        <section>
          <div className="border-b border-m my-4"></div>

          {comments ? (
            <div className="flex flex-1 items-center justify-center my-6">
              <p className="leading-relaxed w-full">
                Mídea sem Comentário, faça o seu.
              </p>
            </div>
          ) : (
            <></>
          )}
          <div className="flex">
            <p>
              <span className="mr-2">{comments.length}</span>
              Comentários
            </p>
            <p className="flex items-center">
              <ArrowDownWideNarrow width={16} height={16} className="mx-2" />
              Sort by
            </p>
          </div>
          <div className="flex my-4 items-center">
            <figure className="w-7 h-7 rounded-full overflow-hidden">
              <Image
                src={`${api.getUri()}/${userLogged.avatarUrl}`}
                alt="Profile Avatar"
                width={150}
                height={32}
                className="bg-cover object-contain"
              />
            </figure>
            <input
              type="text"
              name=""
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                handleKeyPress(e);
              }}
              placeholder="Adicionar Comentário"
              className="appearance-none bg-transparent border-b text-gray-600 w-full ml-4"
            />

            <Send
              className="hover:text-red-700"
              onClick={() => {
                addComment();
              }}
            />
          </div>
          <div>
            {comments.map((comment) => {
              return (
                <div
                  className="flex items-center my-2"
                  key={comment.created_at}
                >
                  <figure className="w-7 h-7 rounded-full overflow-hidden">
                    <Image
                      src={`${api.getUri()}/${comment.user.avatarUrl}`}
                      alt="Profile Avatar"
                      width={150}
                      height={32}
                      className="bg-cover object-contain"
                    />
                  </figure>
                  <div>
                    <div className="mx-2">
                      <p>
                        {comment.user.name}
                        <span className="text-sm ml-4">
                          {new Date(comment.created_at).toDateString()}
                        </span>
                      </p>
                      <p>{comment.message}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </section>

      <Playlist
        name={list.name}
        mideas={list.mideas}
        exclude={list.mideas[currentVideo].id}
      />
    </div>
  );
}
