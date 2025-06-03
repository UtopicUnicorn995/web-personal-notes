import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Timestamp } from "firebase/firestore";
import "./App.css";
import { db } from "./firebase-config";
import {
  collection,
  doc,
  deleteDoc,
  onSnapshot,
  updateDoc,
  query,
  addDoc,
} from "firebase/firestore";
import Notes from "./components/Notes";

const modalRoot = document.getElementById("modal-root");

function App() {
  const [items, setItems] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [selectedUser, setSelectedUser] = useState("Notes");

  useEffect(() => {
    const q = query(collection(db, selectedUser));

    const unSubScribe = onSnapshot(q, (querySnapshot) => {
      const notesArr = [];
      querySnapshot.forEach((doc) => {
        notesArr.push({ ...doc.data(), id: doc.id });
      });
      setItems(notesArr);
    });
    return () => unSubScribe();
  }, [selectedUser]);

  const sortedNotes = (notes) => {
    return [...notes].sort((a, b) => {
      const aTime = a.updatedAt?.toDate ? a.updatedAt.toDate().getTime() : 0;
      const bTime = b.updatedAt?.toDate ? b.updatedAt.toDate().getTime() : 0;
      return bTime - aTime;
    });
  };

  const createNote = async () => {
    try {
      const payload = {
        title: selectedNote.title,
        content: selectedNote.content,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };
      const newNoteRef = collection(db, selectedUser);
      const newNote = await addDoc(newNoteRef, payload);
      setSelectedNote((prev) => ({ ...prev, id: newNote.id }));
    } catch (error) {
      console.error("Error creating a new note", error);
    }
  };

  const updateNote = async () => {
    const payload = {
      title: selectedNote.title,
      content: selectedNote.content,
      updatedAt: Timestamp.now(),
    };
    try {
      const noteRef = doc(db, selectedUser, selectedNote.id);
      await updateDoc(noteRef, payload);
    } catch (error) {
      console.error("error updating notes.", error);
    }
  };

  const deleteNote = async (itemId) => {
    if (!itemId) {
      setSelectedNote(null);
    } else {
      try {
        const noteRef = doc(db, selectedUser, itemId);
        await deleteDoc(noteRef);
        setSelectedNote(null);
      } catch (error) {
        console.error("Error deleting notes", error);
      }
    }
  };

  return (
    <>
      <main className="@container min-h-screen bg-[#F8EEE2]">
        <div className="mx-auto w-full max-w-6xl p-3 sm:p-6">
          <h1
            onClick={() =>
              setSelectedUser(selectedUser === "Notes" ? "Notes2" : "Notes")
            }
            className="text-[#262626] text-center mb-3 sm:mb-6 text-lg sm:text-2xl font-semibold select-none"
          >
            {selectedUser === "Notes" ? "Unicorn's" : "Kristine's"} personal
            notes
          </h1>
          <button
            onClick={() =>
              setSelectedNote({
                title: "",
                content: "",
                id: null,
              })
            }
            className="mb-4 px-4 py-2 bg-white text-[#262626] rounded-md hover:bg-gray-200 w-full sm:w-auto cursor-pointer"
          >
            + New Note
          </button>
          <div className="grid pb-6 grid-cols-2 gap-3 sm:gap-4 md:flex md:flex-wrap md:grid-cols-none">
            {sortedNotes(items).map((item) => (
              <Notes
                key={item.id}
                item={item}
                onClick={() => setSelectedNote(item)}
              />
            ))}
          </div>
        </div>
      </main>
      {selectedNote &&
        createPortal(
          <div
            className="relative z-10"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
          >
            <div
              className="fixed inset-0 bg-gray-500/75 transition-opacity"
              aria-hidden="true"
            ></div>

            <div
              onClick={() => setSelectedNote(null)}
              className="fixed inset-0 z-10 w-screen overflow-y-auto"
            >
              <div className="flex min-h-full w-full items-center justify-center p-4 text-text sm:items-center sm:p-0">
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full max-w-lg"
                >
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start w-full">
                      <div className="mt-3 text-text sm:mt-0 sm:mx-4 sm:text-left w-full">
                        <div className="flex justify-between">
                          <h3
                            className="text-base font-semibold text-gray-900"
                            id="modal-title"
                          >
                            Edit note
                          </h3>
                          <div onClick={() => deleteNote(selectedNote.id)}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="size-6 text-red-500"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                              />
                            </svg>
                          </div>
                        </div>
                        <div className="mt-2 flex flex-col gap-5">
                          <div className="flex flex-col gap-4">
                            <label htmlFor="" className="block text-sm">
                              Title
                            </label>

                            <input
                              type="text"
                              name="title"
                              value={selectedNote.title}
                              onChange={(e) =>
                                setSelectedNote((prev) => ({
                                  ...prev,
                                  title: e.target.value,
                                }))
                              }
                              id="title"
                              className="w-full rounded-md bg-white px-3 py-2 outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600"
                            />
                          </div>
                          <div className="flex flex-col gap-4">
                            <label htmlFor="" className="block text-sm">
                              Content
                            </label>
                            <textarea
                              type="text"
                              name="Content"
                              id="content"
                              rows={5}
                              value={selectedNote.content}
                              onChange={(e) =>
                                setSelectedNote((prev) => ({
                                  ...prev,
                                  content: e.target.value.replace(
                                    /^-\s/gm,
                                    "● "
                                  ),
                                }))
                              }
                              className="w-full rounded-md bg-white px-3 py-2 outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      onClick={selectedNote.id ? updateNote : createNote}
                      type="button"
                      className="inline-flex hover:cursor-pointer w-full justify-center rounded-md border border-gray-300 bg-[#F8EEE2] px-3 py-2 text-sm font-semibold text-[#262626] shadow-xs hover:bg-[#ede2d5] sm:ml-3 sm:w-auto"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setSelectedNote(null)}
                      type="button"
                      className="mt-3 hover:cursor-pointer inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          modalRoot
        )}
    </>
  );
}

export default App;
