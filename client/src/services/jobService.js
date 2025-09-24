import axios from "axios";
import { BASE_URL } from "./constants";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  // You can add interceptors here for logging/errors if needed
});

function cleanParams(params = {}) {
  const out = {};
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    if (typeof v === "string" && v.trim() === "") return;
    out[k] = v;
  });
  return out;
}

export async function getJobs(params = {}) {
  const response = await api.get("/jobs", { params: cleanParams(params) });
  return response.data;
}

export async function getJob(id) {
  const response = await api.get(`/jobs/${id}`);
  return response.data;
}

export async function createJob(job) {
  const response = await api.post("/jobs", job);
  return response.data;
}

export async function updateJob(id, job) {
  const response = await api.put(`/jobs/${id}`, job);
  return response.data;
}

export async function patchJob(id, partial) {
  const response = await api.patch(`/jobs/${id}`, partial);
  return response.data;
}

export async function deleteJob(id) {
  await api.delete(`/jobs/${id}`);
  return true;
}

export async function triggerScrape(token) {
  const trimmed = String(token || "").trim();
  const response = await api.post(
    `/jobs/scrape`,
    {},
    { params: { token: trimmed }, headers: { "x-scrape-token": trimmed } }
  );
  return response.data;
}

export async function health() {
  const response = await api.get("/health");
  return response.data;
}
