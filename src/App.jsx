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
import Toast from "./components/Toast";
import PreviewModal from "./components/PreviewModal";

const modalRoot = document.getElementById("modal-root");

function App() {
  const [items, setItems] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [selectedUser, setSelectedUser] = useState("Notes");
  const [showModal, setShowModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewNote, setPreviewNote] = useState(null);
  const [toast, setToast] = useState({
    show: false,
    title: "",
    description: "",
  });

  useEffect(() => {
    if (selectedNote) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [selectedNote]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedNote(false);
      }
    };

    if (selectedNote) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedNote]);

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
      console.log("neww", newNote);
      setToast({
        show: true,
        title: "success",
        description: `You have sucessfully added ${selectedNote.title}`,
      });
    } catch (error) {
      console.error("Error creating a new note", error);
      setToast({
        show: true,
        title: "failed",
        description: `You have failed creating a note.`,
      });
    } finally {
      setTimeout(() => {
        setToast({
          show: false,
          title: "",
          description: ``,
        });
      }, 3000);
    }
  };

  const updateNote = async (item) => {
    if (
      item.content === selectedNote.content &&
      item.title === selectedNote.title
    ) {
      return;
    }
    const payload = {
      title: selectedNote.title,
      content: selectedNote.content,
      updatedAt: Timestamp.now(),
    };
    try {
      const noteRef = doc(db, selectedUser, selectedNote.id);
      await updateDoc(noteRef, payload);
      setToast({
        show: true,
        title: "success",
        description: `You have sucessfully updated ${selectedNote.title}`,
      });
    } catch (error) {
      console.error("error updating notes.", error);
      setToast({
        show: true,
        title: "failed",
        description: `You have failed updating a note.`,
      });
    } finally {
      setTimeout(() => {
        setToast({
          show: false,
          title: "",
          description: ``,
        });
      }, 3000);
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
        setToast({
          show: true,
          title: "success",
          description: `You have sucessfully deleted ${selectedNote.title}`,
        });
      } catch (error) {
        console.error("error deleting notes.", error);
        setToast({
          show: true,
          title: "failed",
          description: `You have failed deleting a note.`,
        });
      } finally {
        setTimeout(() => {
          setToast({
            show: false,
            title: "",
            description: ``,
          });
        }, 3000);
      }
    }
  };

  return (
    <>
      <main
        className={`@container min-h-screen ${
          selectedUser === "Notes2" ? "bg-[#FFF0E0]" : "bg-[#F8EEE2]"
        } `}
      >
        {toast.show && (
          <Toast title={toast.title} description={toast.description} />
        )}
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
            className={`mb-4 px-4 py-2 ${
              selectedUser === "Notes2"
                ? "bg-[#FFF8B5] hover:bg-[#FFE875]"
                : " bg-white hover:bg-gray-200"
            } text-[#262626] rounded-md  w-full sm:w-auto cursor-pointer`}
          >
            + New Note
          </button>
          <div className="grid pb-6 grid-cols-2 gap-3 sm:gap-4 md:flex md:flex-wrap md:grid-cols-none">
            {sortedNotes(items).map((item) => (
              <Notes
                selectedUser={selectedUser}
                key={item.id}
                item={item}
                onClick={() => setSelectedNote(item)}
                onClickPreview={() => {
                  setPreviewNote(item);
                  setShowPreviewModal(true);
                }}
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
                  className={`relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all duration-300 sm:my-8 w-full max-w-lg
                    ${
                      showModal ? "opacity-100 scale-100" : "opacity-0 scale-95"
                    }
                  `}
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
                          <div onClick={() => setConfirmDelete(true)}>
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
                              className="w-full no-scrollbar rounded-md bg-white px-3 py-2 outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between align-middle px-4 py-3">
                    <div className="sm:px-6 items-center justify-center">
                      <button
                        onClick={() => {
                          setPreviewNote(selectedNote);
                          setShowPreviewModal(true);
                        }}
                        type="button"
                        className="mt-3 hover:cursor-pointer inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      >
                        Preview
                      </button>
                    </div>
                    <div className="bg-white  sm:flex sm:flex-row-reverse sm:px-6">
                      <button
                        onClick={
                          selectedNote.id
                            ? () =>
                                updateNote(
                                  items.find((i) => i.id === selectedNote.id)
                                )
                            : createNote
                        }
                        type="button"
                        className="inline-flex mt-3 sm:mt-0 transition delay-150 duration-300 ease-in-out hover:cursor-pointer w-full justify-center rounded-md border border-gray-300 bg-[#F8EEE2] px-3 py-2 text-sm font-semibold text-[#262626] shadow-xs hover:bg-[#ede2d5] sm:ml-3 sm:w-auto"
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

                  {confirmDelete && (
                    <div
                      onClick={() => setConfirmDelete(false)}
                      className={`fixed inset-0 z-20 flex items-center justify-center bg-black/30 transform transition duration-300 ease-in-out ${
                        confirmDelete
                          ? "opacity-100 scale-100 pointer-events-auto"
                          : "opacity-0 scale-95 pointer-events-none"
                      }`}
                    >
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl"
                      >
                        <h2 className="mb-2 text-lg font-semibold text-gray-800">
                          Delete this note?
                        </h2>
                        <p className="mb-6 text-sm text-gray-600">
                          This action can’t be undone.
                        </p>

                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setConfirmDelete(false)}
                            className="rounded-md bg-gray-100 px-3 py-2 text-sm hover:bg-gray-200"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              deleteNote(selectedNote.id);
                              setConfirmDelete(false);
                            }}
                            className="rounded-md bg-red-500 px-3 py-2 text-sm text-white hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>,
          modalRoot
        )}

      {showPreviewModal && previewNote && (
        <PreviewModal
          note={previewNote}
          onClose={() => {
            setShowPreviewModal(false);
            setPreviewNote(null);
          }}
        />
      )}
    </>
  );
}

export default App;
