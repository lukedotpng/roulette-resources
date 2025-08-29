import { createClient } from "@supabase/supabase-js";
const publicConnectionString = "https://nrszlphsudhixnqsxjfn.supabase.co";
const publicAnonKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5yc3pscGhzdWRoaXhucXN4amZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI2ODE4NjksImV4cCI6MjA0ODI1Nzg2OX0.FAPdr2uft-QlxmnishaiGmvu9SGv7LmGlRPScVNgBB4";

export const supabase = createClient(publicConnectionString, publicAnonKey);
