import CircularProgress from "@mui/joy/CircularProgress";

export default function CircularProgressThickness() {
  return (
    <CircularProgress
      color="danger"
      determinate={false}
      size="lg"
      value={25}
      variant="solid"
      thickness={2}
    />
  );
}
