"use client";

import { useState, useEffect } from "react";

import { StaticImageData } from "next/image";
import DeleteButton from "@/components/delete-button";
import { useItemSelection } from "@/components/utils/use-item-selection";
import CustomersTableItem from "./customers-table-item";
import TipTapDoc from "./document";
import { format } from "date-fns";

export interface DocumentVersion {
  date: string;
  content: string;
}

export interface Document {
  id: number;
  name: string;
  date: string;
  content: string;
  versions: DocumentVersion[];
}

interface VersionHistoryProps {
  versions: DocumentVersion[];
  onRevert: (content: string) => void;
}

const VersionHistory: React.FC<VersionHistoryProps> = ({
  versions,
  onRevert,
}) => (
  <div className="version-history" style={{ paddingTop: "1rem" }}>
    <ul>
      {versions.map((version, index) => (
        <li key={index}>
          <button onClick={() => onRevert(version.content)}>
            {version.date.toLocaleString()}
          </button>
        </li>
      ))}
    </ul>
  </div>
);

export default function CustomersTable() {
  const [documentIsOpen, setDocumentIsOpen] = useState<boolean>(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
  const [initialContent, setInitialContent] = useState("<p></p>");
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>("");
  const [versionHistoryIsOpen, setVersionHistoryIsOpen] =
    useState<boolean>(false);

  // Load documents from localStorage on component mount
  useEffect(() => {
    const savedDocuments = JSON.parse(
      localStorage.getItem("documents") || "[]"
    );
    setDocuments(savedDocuments);
    setIsLoaded(true);
  }, []);

  // Save documents to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("documents", JSON.stringify(documents));
    }
  }, [documents, isLoaded]);

  const handleSave = (html: string) => {
    if (currentDocument) {
      const updatedDocuments = documents.map((doc) =>
        doc.id === currentDocument.id
          ? {
              ...doc,
              content: html,
              versions: [
                ...currentDocument.versions,
                {
                  date: format(new Date(), "MMM dd yyyy h:mm a"),
                  content: html,
                },
              ],
            }
          : doc
      );
      setDocuments(updatedDocuments);
      setCurrentDocument({ ...currentDocument, content: html });
    }
  };

  const handleNewDocument = () => {
    const newDocument: Document = {
      id: Date.now(),
      name: `Document ${documents.length + 1}`,
      date: format(new Date(), "MMM dd yyyy h:mm a"),
      content: "<p></p>",
      versions: [
        {
          date: format(new Date(), "MMM dd yyyy h:mm a"),
          content: "<p></p>",
        },
      ],
    };
    const updatedDocuments = [...documents, newDocument];
    setDocuments(updatedDocuments);
    setCurrentDocument(newDocument);
    setInitialContent(newDocument.content);
    setEditName(newDocument.name);
    setDocumentIsOpen(true);
  };

  const handleLoadDocument = (doc: Document) => {
    setCurrentDocument(doc);
    setInitialContent(doc.content);
    setEditName(doc.name);
    setDocumentIsOpen(true);
  };

  const handleGoBack = () => {
    setDocumentIsOpen(false);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditName(event.target.value);
  };

  const handleSaveName = () => {
    if (currentDocument) {
      const updatedDocuments = documents.map((doc) =>
        doc.id === currentDocument.id ? { ...doc, name: editName } : doc
      );
      setDocuments(updatedDocuments);
      setCurrentDocument({ ...currentDocument, name: editName });
    }
  };

  const handleRevert = (content: string) => {
    if (currentDocument) {
      setCurrentDocument({ ...currentDocument, content });
      setInitialContent(content);
    }
  };

  const handleDelete = () => {
    console.log(`Deleting ${selectedItems.length} items`);
    const updatedDocuments = documents.filter(
      (doc) => !selectedItems.includes(doc.id)
    );
    setDocuments(updatedDocuments);
  };

  const {
    selectedItems,
    isAllSelected,
    handleCheckboxChange,
    handleSelectAllChange,
  } = useItemSelection(documents);

  return (
    <div>
      {!documentIsOpen ? (
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl relative">
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <header style={{ margin: "0rem" }} className="px-5 py-4">
              <h2 className="font-semibold text-gray-800 dark:text-gray-100">
                All Documents{" "}
                <span className="text-gray-400 dark:text-gray-500 font-medium">
                  {documents.length}
                </span>
              </h2>
            </header>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <div style={{ margin: "auto", marginRight: "0.6rem" }}>
                <div
                  onClick={() => handleDelete()}
                  className={`${selectedItems.length < 1 && "hidden"}`}
                >
                  <div className="flex items-center">
                    <div className="hidden xl:block text-sm italic mr-2 whitespace-nowrap">
                      <span>{selectedItems.length}</span> items selected
                    </div>
                    <button className="btn bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-red-500">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
              {/* Add Document button */}
              <button
                style={{
                  height: "2rem",
                  margin: "auto",
                  marginRight: "0.6rem",
                }}
                className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
                onClick={handleNewDocument}
              >
                <svg
                  className="fill-current shrink-0 xs:hidden"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                >
                  <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                </svg>
                <span className="max-xs:sr-only">Add Document</span>
              </button>
            </div>
          </div>
          <div>
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="table-auto w-full dark:text-gray-300">
                {/* Table header */}
                <thead className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20 border-t border-b border-gray-100 dark:border-gray-700/60">
                  <tr>
                    <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px">
                      <div className="flex items-center">
                        <label className="inline-flex">
                          <span className="sr-only">Select all</span>
                          <input
                            className="form-checkbox"
                            type="checkbox"
                            onChange={handleSelectAllChange}
                            checked={isAllSelected}
                          />
                        </label>
                      </div>
                    </th>
                    {/* <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px">
                  <span className="sr-only"></span>
                </th> */}
                    <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                      <div className="font-semibold text-left">
                        Document Title
                      </div>
                    </th>
                    <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                      <div className="font-semibold text-left"></div>
                    </th>
                    <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                      <div className="font-semibold text-left"></div>
                    </th>
                    <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                      <div className="font-semibold"></div>
                    </th>
                    <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                      <div className="font-semibold text-left">Date</div>
                    </th>
                    <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                      <div className="font-semibold text-left"></div>
                    </th>
                    <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                      <div className="font-semibold"></div>
                    </th>
                    <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                      <span className="sr-only">Menu</span>
                    </th>
                  </tr>
                </thead>
                {/* Table body */}
                <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
                  {documents.map((document) => (
                    <CustomersTableItem
                      key={document.id}
                      customer={document}
                      onCheckboxChange={handleCheckboxChange}
                      onDocumentClick={(doc) => handleLoadDocument(doc)}
                      isSelected={selectedItems.includes(document.id)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div
            className="bg-white dark:bg-gray-800 shadow-sm rounded-xl relative"
            style={{ padding: "1rem" }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  margin: "0.4rem",
                  marginBottom: "1rem",
                }}
              >
                {currentDocument && currentDocument.name && (
                  <div>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      <input
                        type="text"
                        value={editName}
                        onChange={handleNameChange}
                        onBlur={handleSaveName}
                        style={{
                          backgroundColor: "#212936",
                          color: "White",
                          fontSize: "2rem",
                          fontWeight: "bold",
                          border: "1px solid gray",
                          borderRadius: "0.25rem",
                          padding: "0.5rem",
                        }}
                      />
                      <button
                        className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
                        onClick={() => setVersionHistoryIsOpen((prev) => !prev)} // Save current content
                        style={{
                          height: "2.5rem",
                          margin: "auto",
                          marginLeft: "1.5rem",
                        }}
                      >
                        <svg
                          className="fill-current shrink-0 xs:hidden"
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                        >
                          <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                        </svg>
                        <span className="max-xs:sr-only">
                          Toggle Version History
                        </span>
                      </button>
                    </div>

                    {versionHistoryIsOpen && (
                      <VersionHistory
                        versions={currentDocument.versions}
                        onRevert={handleRevert}
                      ></VersionHistory>
                    )}
                  </div>
                )}
                <div
                  style={{
                    height: "2rem",
                    margin: "auto",
                    marginRight: "0.6rem",
                  }}
                >
                  <button
                    className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
                    onClick={() => handleGoBack()} // Save current content
                  >
                    <svg
                      className="fill-current shrink-0 xs:hidden"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                    >
                      <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                    </svg>
                    <span className="max-xs:sr-only">Go Back</span>
                  </button>
                </div>
              </div>
              <TipTapDoc
                initialContent={initialContent}
                onSave={(content) => {
                  setInitialContent(content);
                  handleSave(content);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
