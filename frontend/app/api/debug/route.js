import axios from "axios";
export async function GET() {
  try {
    const backendUrl =
      process.env.NEXT_APP_BACKEND_URL || "http://localhost:8080";
    console.log("backendurl", backendUrl);

    const response = await axios.get(`${backendUrl}/api/health`);
    console.log("response", response);
    return Response.json({ status: "ok", result: response.data });
  } catch (error) {
    return Response.json(
      { status: "error", message: error.message },
      { status: 500 }
    );
  }
}
