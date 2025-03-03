import axios from "axios";
export async function GET() {
  try {
    const backendUrl = process.env.NEXT_APP_BACKEND_URL;
    const url = `${backendUrl}/api/todo`;
    const response = await axios.get(url);
    console.log("response", response);
    return Response.json({ status: "ok", result: response.data });
  } catch (error) {
    return Response.json(
      { status: "error", message: error.message },
      { status: 500 }
    );
  }
}
export async function POST(request) {
  try {
    const backendUrl = process.env.NEXT_APP_BACKEND_URL;

    const body = await request.json();
    const { todo } = body;
    if (!todo) {
      return Response.json(
        { status: "error", message: "todo is required" },
        { status: 400 }
      );
    }
    const url = `${backendUrl}/api/todo`;
    const requestData = { todo };
    const response = await axios.post(url, requestData);

    return Response.json({ status: "ok", result: response.data });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return Response.json(
      { status: "error", message: error.message },
      { status: 500 }
    );
  }
}
