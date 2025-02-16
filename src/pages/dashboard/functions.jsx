import React, { useState, memo, useEffect } from "react";
import { Plus, X, Loader2, Trash2, Code2 } from "lucide-react";
import { AppLayout } from "@/components/_shared/app-layout";
import { useAssistants } from "@/providers/assistants-provider";
import { API_BASE_URL } from "@/config";

const ModalForm = memo(
  ({
    func,
    onSubmit,
    onClose,
    onDelete,
    isSubmitting,
    isDeleting,
    error,
    isNewFunction,
    testResponse,
  }) => {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [formData, setFormData] = useState({
      name: func?.name || "",
      endpoint: func?.endpoint || "",
      method: func?.method || "GET",
      authType: func?.authType || "bearer",
      parameters: {
        query: func?.parameters?.query || {},
        header: func?.parameters?.header || {},
      },
      isActive: func?.isActive !== false,
    });
    const [testArgs, setTestArgs] = useState({});
    const [newParamKey, setNewParamKey] = useState("");
    const [newParamType, setNewParamType] = useState("string");
    const [newParamLocation, setNewParamLocation] = useState("query");
    const [paramError, setParamError] = useState("");
    const [showResponse, setShowResponse] = useState(false);

    useEffect(() => {
      const defaultArgs = {};
      Object.entries(formData.parameters.query).forEach(([key, type]) => {
        defaultArgs[key] =
          type === "string"
            ? ""
            : type === "number"
            ? 0
            : type === "boolean"
            ? false
            : null;
      });
      Object.entries(formData.parameters.header).forEach(([key, type]) => {
        defaultArgs[key] =
          type === "string"
            ? ""
            : type === "number"
            ? 0
            : type === "boolean"
            ? false
            : null;
      });
      setTestArgs(defaultArgs);
    }, [formData.parameters]);

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit({
        ...formData,
        testArgs,
      });
    };

    const addParameter = () => {
      const trimmedKey = newParamKey.trim();
      if (trimmedKey) {
        if (formData.parameters[newParamLocation][trimmedKey]) {
          setParamError(`Parameter "${trimmedKey}" already exists`);
          return;
        }

        setFormData((prev) => ({
          ...prev,
          parameters: {
            ...prev.parameters,
            [newParamLocation]: {
              ...prev.parameters[newParamLocation],
              [trimmedKey]: newParamType,
            },
          },
        }));
        setNewParamKey("");
        setNewParamType("string");
        setParamError("");
      }
    };

    useEffect(() => {
      if (testResponse) {
        setShowResponse(true);
      }
    }, [testResponse]);

    return (
      <div>
        {showResponse ? (
          <div>
            <div className="p-4">
              <div className="text-sm">
                <div className="mb-2">
                  <span className="text-neutral-600">Status Code:</span>{" "}
                  <span
                    className={`font-medium ${
                      testResponse.statusCode >= 200 &&
                      testResponse.statusCode < 300
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {testResponse.statusCode}
                  </span>
                </div>
                <div>
                  <pre className="mt-2 whitespace-pre-wrap bg-white p-3 border text-sm font-mono max-h-[60vh] overflow-y-auto">
                    {JSON.stringify(testResponse.response, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form className="p-4 sm:p-6" onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 bg-red-50 border border-neutral-100 text-red-600 p-3 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-neutral-700">
                  Function Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full h-10 border px-3 text-sm focus:ring-1 border-neutral-200 focus:ring-neutral-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-neutral-700">
                  Endpoint URL
                </label>
                <input
                  type="url"
                  value={formData.endpoint}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      endpoint: e.target.value,
                    }))
                  }
                  className="w-full h-10 border px-3 text-sm focus:ring-1 border-neutral-200 focus:ring-neutral-400 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-neutral-700">
                    Method
                  </label>
                  <select
                    value={formData.method}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        method: e.target.value,
                      }))
                    }
                    className="w-full h-10 border px-3 text-sm focus:ring-1 border-neutral-200 focus:ring-neutral-400 focus:outline-none"
                  >
                    {["GET", "POST", "PUT", "DELETE"].map((method) => (
                      <option key={method} value={method}>
                        {method}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-neutral-700">
                    Auth Type
                  </label>
                  <select
                    value={formData.authType}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        authType: e.target.value,
                      }))
                    }
                    className="w-full h-10 border px-3 text-sm focus:ring-1 border-neutral-200 focus:ring-neutral-400 focus:outline-none"
                  >
                    <option value="bearer">Bearer Token</option>
                    <option value="basic">Basic Auth</option>
                    <option value="none">No Auth</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-neutral-700">
                  Parameters
                </label>
                <div className="border border-neutral-200 p-3 sm:p-4">
                  <div className="max-h-40 overflow-y-auto mb-4 space-y-4">
                    {Object.entries(formData.parameters).map(
                      ([location, params]) =>
                        Object.entries(params).map(([key, type]) => (
                          <div
                            key={`${location}-${key}`}
                            className="flex items-center gap-2"
                          >
                            <span className="text-sm flex-1">
                              {key}: {type} ({location})
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const newParams = { ...formData.parameters };
                                delete newParams[location][key];
                                setFormData((prev) => ({
                                  ...prev,
                                  parameters: newParams,
                                }));
                              }}
                              className="text-red-500 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <input
                      type="text"
                      value={newParamKey}
                      onChange={(e) => {
                        setNewParamKey(e.target.value);
                        setParamError("");
                      }}
                      placeholder="Parameter name"
                      className={`w-full sm:w-auto flex-1 h-10 border px-3 text-sm focus:ring-1 border-neutral-200 focus:ring-neutral-400 focus:outline-none ${
                        paramError ? "border-red-300" : ""
                      }`}
                    />
                    <select
                      value={newParamType}
                      onChange={(e) => setNewParamType(e.target.value)}
                      className="w-full sm:w-auto h-10 border px-3 text-sm focus:ring-1 border-neutral-200 focus:ring-neutral-400 focus:outline-none"
                    >
                      <option value="string">String</option>
                      <option value="number">Number</option>
                      <option value="boolean">Boolean</option>
                    </select>
                    <select
                      value={newParamLocation}
                      onChange={(e) => setNewParamLocation(e.target.value)}
                      className="w-full sm:w-auto h-10 border px-3 text-sm focus:ring-1 border-neutral-200 focus:ring-neutral-400 focus:outline-none"
                    >
                      <option value="query">Query</option>
                      <option value="header">Header</option>
                    </select>
                    <button
                      type="button"
                      onClick={addParameter}
                      className="w-full sm:w-auto h-10 px-4 bg-neutral-900 text-white hover:bg-neutral-800"
                    >
                      Add
                    </button>
                  </div>

                  {paramError && (
                    <div className="mt-2 text-sm text-red-600">
                      {paramError}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 border-t pt-4">
                <h3 className="text-sm font-medium text-neutral-900 mb-4">
                  Test Arguments
                </h3>
                <div className="space-y-3">
                  {Object.entries(formData.parameters).map(
                    ([location, params]) =>
                      Object.entries(params).map(([key, type]) => (
                        <div
                          key={`${location}-${key}`}
                          className="flex flex-col"
                        >
                          <label className="text-sm text-neutral-600 mb-1">
                            {key} ({location})
                          </label>
                          {type === "boolean" ? (
                            <select
                              value={testArgs[key] ? "true" : "false"}
                              onChange={(e) =>
                                setTestArgs((prev) => ({
                                  ...prev,
                                  [key]: e.target.value === "true",
                                }))
                              }
                              className="w-full h-10 border px-3 text-sm focus:ring-1 border-neutral-200 focus:ring-neutral-400 focus:outline-none"
                            >
                              <option value="true">true</option>
                              <option value="false">false</option>
                            </select>
                          ) : (
                            <input
                              type={type === "number" ? "number" : "text"}
                              value={testArgs[key] ?? ""}
                              onChange={(e) =>
                                setTestArgs((prev) => ({
                                  ...prev,
                                  [key]:
                                    type === "number"
                                      ? Number(e.target.value)
                                      : e.target.value,
                                }))
                              }
                              className="w-full h-10 border px-3 text-sm focus:ring-1 border-neutral-200 focus:ring-neutral-400 focus:outline-none"
                              placeholder={`Enter ${type} value`}
                            />
                          )}
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
              {!isNewFunction && (
                <button
                  type="button"
                  onClick={() =>
                    showDeleteConfirm
                      ? onDelete(func)
                      : setShowDeleteConfirm(true)
                  }
                  disabled={isDeleting}
                  className="text-red-500 hover:text-red-600 transition-colors flex items-center gap-2 text-sm disabled:opacity-50"
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  {showDeleteConfirm ? "Confirm Delete" : "Delete"}
                </button>
              )}

              <div className="flex items-center gap-3 w-full sm:w-auto sm:ml-auto">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    onClose();
                  }}
                  disabled={isSubmitting || isDeleting}
                  className="flex-1 sm:flex-none px-4 py-2 text-sm text-neutral-600 hover:text-neutral-900 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    isDeleting ||
                    !formData.name ||
                    !formData.endpoint ||
                    Object.keys(testArgs).length === 0
                  }
                  className="flex-1 sm:flex-none px-4 py-2 bg-neutral-900 text-sm text-white hover:bg-neutral-800 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isNewFunction ? (
                    "Create & Test Function"
                  ) : (
                    "Update & Test Function"
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    );
  }
);

ModalForm.displayName = "ModalForm";

const Modal = memo(({ isOpen, title, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white w-full max-w-2xl">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-neutral-900">
          <h2 className="text-base sm:text-lg text-neutral-200">{title}</h2>
          <button
            onClick={onClose}
            className="text-neutral-200 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
});

Modal.displayName = "Modal";

const FunctionsPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedFunction, setSelectedFunction] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [testResponse, setTestResponse] = useState(null);

  const { currentAssistant, getAssistant } = useAssistants();

  const handleApiCall = async (endpoint, data) => {
    const authToken = localStorage.getItem("lm_auth_token");
    const assistantId = localStorage.getItem("lm_assistant_id");

    const url = `${API_BASE_URL}/function/${endpoint}${
      endpoint === "delete" ? `?functionId=${data.functionId}` : ""
    }`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body:
        endpoint === "delete"
          ? undefined
          : JSON.stringify({ assistantId, ...data }),
    });

    const result = await response.json();
    if (!response.ok)
      throw new Error(result.message || `Failed to ${endpoint} function`);

    await getAssistant();
    return result;
  };

  const handleDelete = async (func) => {
    try {
      setIsDeleting(true);
      await handleApiCall("delete", {
        functionId: func.id,
      });
      setIsEditModalOpen(false);
      setSelectedFunction(null);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCreate = async (data) => {
    try {
      setIsSubmitting(true);
      const response = await handleApiCall("create", data);

      if (response.data?.testResult) {
        setTestResponse(response.data.testResult);
      } else {
        setIsCreateModalOpen(false);
        setError(null);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (data) => {
    try {
      setIsSubmitting(true);
      const response = await handleApiCall("update", {
        ...data,
        functionId: selectedFunction.id,
      });

      if (response.data?.testResult) {
        setTestResponse(response.data.testResult);
      } else {
        setIsEditModalOpen(false);
        setSelectedFunction(null);
        setError(null);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <div className="min-h-[75vh] p-2 sm:p-6 font-light">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-light text-neutral-800">
              Functions
            </h1>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-neutral-900 text-white hover:bg-neutral-800 text-sm"
            >
              <Plus className="h-4 w-4" />
              New Function
            </button>
          </div>

          <div className="space-y-4">
            {currentAssistant?.functions?.map((func) => (
              <div
                key={func.id}
                onClick={() => {
                  setSelectedFunction(func);
                  setIsEditModalOpen(true);
                }}
                className="bg-white border border-neutral-200 hover:border-neutral-300 transition-colors cursor-pointer"
              >
                <div className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <Code2 className="size-4 text-neutral-700" />
                        <h3 className="text-neutral-900 text-md">
                          {func.name}
                        </h3>
                      </div>
                      <div className="text-sm text-neutral-600">
                        {func.endpoint}
                      </div>
                    </div>
                    <span
                      className={`px-2.5 py-1 text-xs rounded-full whitespace-nowrap ${
                        {
                          GET: "bg-emerald-50 text-emerald-700",
                          POST: "bg-blue-50 text-blue-700",
                          PUT: "bg-amber-50 text-amber-700",
                          DELETE: "bg-red-50 text-red-700",
                        }[func.method]
                      }`}
                    >
                      {func.method}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {(!currentAssistant?.functions ||
              currentAssistant.functions.length === 0) && (
              <div className="text-center py-8 sm:py-12 bg-white border border-dashed border-neutral-200">
                <Code2 className="h-8 w-8 text-neutral-800 mx-auto mb-4" />
                <h3 className="text-neutral-900 mb-2">No functions yet</h3>
                <p className="text-neutral-600 text-sm max-w-md mx-auto mb-4 px-4">
                  Add your first API function to enable your assistant to
                  interact with external services.
                </p>
              </div>
            )}
          </div>
        </div>

        <Modal
          isOpen={isCreateModalOpen}
          title="Add New Function"
          onClose={() => {
            setIsCreateModalOpen(false);
            setError(null);
            setTestResponse(null);
          }}
        >
          <ModalForm
            onSubmit={handleCreate}
            onClose={() => {
              setIsCreateModalOpen(false);
              setError(null);
              setTestResponse(null);
            }}
            isSubmitting={isSubmitting}
            isDeleting={isDeleting}
            error={error}
            isNewFunction={true}
            testResponse={testResponse}
          />
        </Modal>

        <Modal
          isOpen={isEditModalOpen}
          title="Edit Function"
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedFunction(null);
            setError(null);
            setTestResponse(null);
          }}
        >
          <ModalForm
            func={selectedFunction}
            onSubmit={handleUpdate}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedFunction(null);
              setError(null);
              setTestResponse(null);
            }}
            onDelete={handleDelete}
            isSubmitting={isSubmitting}
            isDeleting={isDeleting}
            error={error}
            isNewFunction={false}
            testResponse={testResponse}
          />
        </Modal>
      </div>
    </AppLayout>
  );
};

export default FunctionsPage;
