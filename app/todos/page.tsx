import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export default async function TodosPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: todos, error } = await supabase.from("todos").select();

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1>Supabase Connection Test</h1>
      {error && (
        <div style={{ color: "red", marginTop: "10px" }}>
          <p>Note: Table 'todos' returned error: {error.message}</p>
          <p>
            If you haven't created the 'todos' table yet, this is normal. Your Supabase
            connection is configured!
          </p>
        </div>
      )}
      <ul style={{ marginTop: "20px" }}>
        {todos?.map((todo: any) => (
          <li key={todo.id}>{todo.name}</li>
        ))}
      </ul>
      {todos && todos.length === 0 && <p>No todos found (table is empty).</p>}
    </div>
  );
}
