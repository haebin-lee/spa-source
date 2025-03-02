import axios from "axios";
export async function GET() {
  try {
    const backendUrl = process.env.NEXT_APP_BACKEND_URL;
    const url = `${backendUrl}/api/search/history`;
    console.log("url ", url);
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

    // request 객체에서 JSON 데이터 추출
    const body = await request.json();
    const { command } = body;
    console.log("command", command);
    if (!command) {
      return Response.json(
        { status: "error", message: "command is required" },
        { status: 400 }
      );
    }

    const requestData = { command };
    console.log("requestData", requestData);

    const url = `${backendUrl}/api/search`;
    console.log("url ", url);

    const response = await axios.post(url, requestData);
    console.log("response", response);

    return Response.json({ status: "ok", result: response.data });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return Response.json(
      { status: "error", message: error.message },
      { status: 500 }
    );
  }
}
