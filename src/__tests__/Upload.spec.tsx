import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import SomePage from "../components/upload";
import { uploadFileToFirebase } from "../utils/firebaseupload";

jest.mock("../utils/firebaseupload");

beforeAll(() => {
  window.alert = jest.fn(); // Mock alert to prevent JSDOM issues
  jest.spyOn(console, "error").mockImplementation(() => {}); // Mock console.error
});

describe("SomePage", () => {
  const mockUploadFileToFirebase = uploadFileToFirebase as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("handles file upload successfully", async () => {
    mockUploadFileToFirebase.mockResolvedValueOnce(
      "https://example.com/file.png"
    );

    render(<SomePage />);
    const fileInput = screen.getByTestId("file-input");

    const file = new File(["dummy content"], "example.png", {
      type: "image/png",
    });
    fireEvent.change(fileInput, { target: { files: [file] } });

    await act(async () => {
      fireEvent.click(screen.getByText(/upload file/i));
    });

    await waitFor(() =>
      expect(mockUploadFileToFirebase).toHaveBeenCalledWith(
        file,
        expect.any(Function)
      )
    );

    await waitFor(() =>
      expect(screen.getByText(/file uploaded!/i)).toBeInTheDocument()
    );

    expect(screen.getByText(/view file/i).closest("a")).toHaveAttribute(
      "href",
      "https://example.com/file.png"
    );
  });

  test("handles file upload failure", async () => {
    mockUploadFileToFirebase.mockRejectedValueOnce(new Error("Upload failed"));

    render(<SomePage />);
    const fileInput = screen.getByTestId("file-input");

    const file = new File(["dummy content"], "example.png", {
      type: "image/png",
    });
    fireEvent.change(fileInput, { target: { files: [file] } });

    await act(async () => {
      fireEvent.click(screen.getByText(/upload file/i));
    });

    await waitFor(() =>
      expect(mockUploadFileToFirebase).toHaveBeenCalledWith(
        file,
        expect.any(Function)
      )
    );

    expect(console.error).toHaveBeenCalledWith(
      "File upload failed:",
      expect.any(Error)
    );
  });

  test("shows upload progress", async () => {
    mockUploadFileToFirebase.mockImplementation((_, onProgress) => {
      onProgress(50); // Simulate 50% progress
      return Promise.resolve("https://example.com/file.png");
    });

    render(<SomePage />);
    const fileInput = screen.getByTestId("file-input");

    const file = new File(["dummy content"], "example.png", {
      type: "image/png",
    });
    fireEvent.change(fileInput, { target: { files: [file] } });

    await act(async () => {
      fireEvent.click(screen.getByText(/upload file/i));
    });

    await waitFor(() =>
      expect(screen.getByText(/upload progress: 50%/i)).toBeInTheDocument()
    );
  });
});
