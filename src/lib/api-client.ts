import { object } from "zod";

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
    // Only set Content-Type for JSON requests
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


    async uploadparent(data:object){
        return this.fetch("files/upload", {
            method: "POST",
            body: data
        })
    };


    async getFiles(){
        return this.fetch("files")
    };


    async starFiles(id:string){
        return this.fetch(`files/star?id=${id}`, {
            method: "PATCH"
        })
    };


    async delFiles(id:string){
        return this.fetch(`files/delete?id=${id}`)
    };

    async trashFile(){
        return this.fetch("files/trash")
    }

}

export const apiClient = new ApiClient();   