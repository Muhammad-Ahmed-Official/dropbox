type FetchOptions = {
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    body?: any;
    headers?: Record<string, string>
}

class ApiClient {
   private async fetch<T>(endPoint: string, options: FetchOptions = {}): Promise<T> {
  const { method = "GET", body, headers = {} } = options;

  let finalHeaders = { ...headers };
  let finalBody = body;

  if (!(body instanceof FormData)) {
    finalHeaders["Content-Type"] = "application/json";
    finalBody = body ? JSON.stringify(body) : undefined;
  }

  const response = await fetch(`/api/${endPoint}`, {
    method,
    headers: finalHeaders,
    body: finalBody,
  });

  if (!response.ok) throw new Error(await response.text());
  return response.json();
}



    async signUp(){
        return this.fetch("users", {
            method: 'POST'
        })
    };

    async createFolder(data:object){
        return this.fetch("folders/create", {
            method: "POST",
            body: data
        })
    };


    async uploadFile(data:object, config?: any){
        return this.fetch("files/upload", {
            method: "POST",
            body: data
        })
    };


    async getFiles(params: { userId: string; parentId?: string }) {
        const { userId, parentId } = params;
        const url = parentId 
            ? `files?userId=${userId}&parentId=${parentId}` 
            : `files?userId=${userId}`;

        return this.fetch(url);
    }


    async starFiles(fileId:string){
        return this.fetch(`files/${fileId}/star`, {
            method: "PATCH"
        })
    };


    async delFiles(fileId:string){
        return this.fetch(`files/${fileId}/delete`, {
            method: "DELETE"
        })
    };


    async trashFile(fileId:string){
        return this.fetch(`files/${fileId}/trash`, {
            method: 'PATCH'
        })
    };


    async emptyTrash() {
        return this.fetch(`files/empty-trash`, {
            method: "DELETE"
        })
    };
}
export const apiClient = new ApiClient();   