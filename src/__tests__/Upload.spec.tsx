import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SomePage from "../components/upload"; // Adjust the import according to your structure
import { uploadFileToFirebase } from "../utils/firebaseupload"; // Import the function to mock

jest.mock("../utils/firebaseupload");

describe("SomePage", () => {
  const mockUploadFileToFirebase = uploadFileToFirebase as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders upload input and button", () => {
    render(<SomePage />);
    expect(screen.getByText(/upload file/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/file/i)).toBeInTheDocument(); // Check if input is rendered
  });

  test("handles file selection", () => {
    render(<SomePage />);
    const fileInput = screen.getByLabelText(/file/i);
    
    const file = new File(["dummy content"], "example.png", { type: "image/png" });
    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(screen.getByText(/upload file/i)).toBeEnabled();
  });

  test("handles file upload successfully", async () => {
    mockUploadFileToFirebase.mockResolvedValueOnce("https://png.pngtree.com/element_our/20190528/ourmid/pngtree-url-small-icon-opened-in-the-browser-image_1132270.jpg");

    render(<SomePage />);
    const fileInput = screen.getByLabelText(/file/i);
    
    const file = new File(["dummy content"], "example.png", { type: "image/png" });
    fireEvent.change(fileInput, { target: { files: [file] } });

    fireEvent.click(screen.getByText(/upload file/i));

    expect(screen.getByText(/uploading started, spinner should show now/i)).toBeInTheDocument();

    await waitFor(() => expect(mockUploadFileToFirebase).toHaveBeenCalledWith(file, expect.any(Function)));

    await waitFor(() => expect(screen.getByText(/file uploaded!/i)).toBeInTheDocument());
    expect(screen.getByText(/view file/i).closest("a")).toHaveAttribute("href", "https://png.pngtree.com/element_our/20190528/ourmid/pngtree-url-small-icon-opened-in-the-browser-image_1132270.jpg");
  });

  test("handles file upload failure", async () => {
    mockUploadFileToFirebase.mockRejectedValueOnce(new Error("Upload failed"));

    render(<SomePage />);
    const fileInput = screen.getByLabelText(/file/i);
    
    const file = new File(["dummy content"], "example.png", { type: "image/png" });
    fireEvent.change(fileInput, { target: { files: [file] } });

    fireEvent.click(screen.getByText(/upload file/i));

    await waitFor(() => expect(mockUploadFileToFirebase).toHaveBeenCalledWith(file, expect.any(Function)));

    // You can also check for console error or any other error handling you implement
  });

  test("shows upload progress", async () => {
    mockUploadFileToFirebase.mockImplementation((file, onProgress) => {
      console.log(file);
      onProgress(50); // Simulate 50% progress
      return Promise.resolve("https://png.pngtree.com/element_our/20190528/ourmid/pngtree-url-small-icon-opened-in-the-browser-image_1132270.jpg");
    });

    render(<SomePage />);
    const fileInput = screen.getByLabelText(/file/i);
    
    const file = new File(["dummy content"], "example.png", { type: "image/png" });
    fireEvent.change(fileInput, { target: { files: [file] } });

    fireEvent.click(screen.getByText(/upload file/i));

    await waitFor(() => expect(screen.getByText(/upload progress: 50%/i)).toBeInTheDocument());
  });
});
