import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useTheme,
  CircularProgress,
  TextField,
  Card,
  CardContent,
  Alert,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import SearchBar from "../../components/text/SearchText";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getAllBlogs } from "../../store/blogs";
import { selectBlogSearch } from "../../store/blogs/selectors";
import Text2 from "../../components/text/Text2";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const [isPublished, setIsPublished] = useState(false);

  const dispatch = useAppDispatch();
  const searchText = useAppSelector(selectBlogSearch);
  const navigate = useNavigate();

  const theme = useTheme();

  const [search, setSearch] = useState(searchText);

  const [addrInput, setAddrInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [meta, setMeta] = useState<any>(null);

  const handleSearchChange = (str: string) => {
    setSearch(str);
  };

  const handleSearchSubmit = (evt: any) => {
    if (evt.key === "Enter") dispatch(getAllBlogs({ search: search, page: 1 }));
  };

  const handleDetail = () => {
    navigate("/sell");
  };

  const lookup = async () => {
    setErrorMsg("");
    setMeta(null);
    setLoading(true);
    try {
      const { data } = await axios.get("/api/technical_assessment", {
        params: { address: addrInput },
      });
      setMeta(data);
    } catch (err: any) {
      setErrorMsg(
        err.response?.data?.error || err.message || "Request failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const label = { inputProps: { "aria-label": "Checkbox demo" } };

  return (
    <Box>
      <Box sx={{ background: "linear-gradient(to bottom, #173039, #00b4c9)" }}>
        <Box
          sx={{
            padding: "50px 80px",
            [theme.breakpoints.up("sm")]: { maxWidth: "1400px" },
            width: "calc(100vw - 6px)",
            margin: "auto",
            textAlign: "left",
          }}
        >
          <Typography
            sx={{
              fontSize: "45px",
              lineHeight: "60px",
              color: "#fff",
              fontWeight: 700,
              marginBottom: "20px",
            }}
          >
            Filters
          </Typography>
          <SearchBar
            search={search}
            handleSearch={handleSearchChange}
            handleKeyDown={handleSearchSubmit}
          />
          <Box
            sx={{ display: "flex", alignItems: "center", paddingLeft: "20px" }}
          >
            <Checkbox
              {...label}
              checked={isPublished}
              sx={{ "& .MuiSvgIcon-root": { fill: "#ffffff" } }}
              onClick={(e: any) => setIsPublished(!isPublished)}
            />
            <Typography
              sx={{
                fontSize: "18px",
                lineHeight: "60px",
                color: "#fff",
                fontWeight: 400,
              }}
            >
              Show only whitelisted properties's offers
            </Typography>
          </Box>

          <Box sx={{ mt: 4, mb: 2 }}>
            <TextField
              label="Contract address"
              value={addrInput}
              onChange={(e) => setAddrInput(e.target.value)}
              size="small"
              sx={{ mr: 2, width: "420px", backgroundColor: "#fff" }}
            />
            <Button
              variant="contained"
              onClick={lookup}
              disabled={loading || !addrInput}
            >
              {loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "Lookup"
              )}
            </Button>
          </Box>
          {errorMsg && (
            <Alert severity="error" sx={{ mb: 2, maxWidth: 600 }}>
              {errorMsg}
            </Alert>
          )}
          {meta && (
            <Card sx={{ mb: 4, maxWidth: 600 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Smart-Contract Metadata
                </Typography>
                <Typography>
                  <strong>Contract:</strong> {meta.contractAddress}
                </Typography>
                <Typography>
                  <strong>Creator:</strong> {meta.creatorAddress}
                </Typography>
                <Typography>
                  <strong>Tx Hash:</strong> {meta.creationTxHash}
                </Typography>
                <Typography>
                  <strong>Deployed:</strong>{" "}
                  {new Date(
                    meta.deploymentTimestamp * 1000
                  ).toLocaleString()}
                </Typography>
                <Typography>
                  <strong>Network:</strong> {meta.networkName} (chain{" "}
                  {meta.chainId})
                </Typography>
              </CardContent>
            </Card>
          )}
        </Box>
      </Box>
      <Box
        sx={{
          minHeight: "calc(100vh - 450px)",
          backgroundColor: "#fff",
          padding: "80px 24px",
          display: "flex",
          gap: "20px",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#00dbe3",
              borderRadius: "6px",
              width: "352px",
              height: "64px",
              fontSize: "24px",
              lineHeight: "60px",
              textTransform: "uppercase",
              color: "#ffffff",
              fontWeight: 700,
            }}
          >
            Sell
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#23a2bb",
              borderRadius: "6px",
              width: "352px",
              height: "64px",
              fontSize: "24px",
              lineHeight: "60px",
              textTransform: "uppercase",
              color: "#ffffff",
              fontWeight: 700,
            }}
          >
            Buy
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#173039",
              borderRadius: "6px",
              width: "352px",
              height: "64px",
              fontSize: "24px",
              lineHeight: "60px",
              textTransform: "uppercase",
              color: "#ffffff",
              fontWeight: 700,
            }}
          >
            Exchange
          </Button>
        </Box>
        <Box sx={{ overflow: "auto", width: { sm: "100%" } }}>
          <Table
            aria-label="simple table"
            sx={{
              borderCollapse: "unset",
              whiteSpace: "nowrap",
              borderRadius: "8px",
              border: "2px solid #00dbe3",
            }}
          >
            <TableHead sx={{ background: "#f3f3f3" }}>
              <TableRow
                sx={{
                  "& th": {
                    padding: "0px 5px",
                    borderRight: "2px solid #00dbe3",
                  },
                  "& th:first-child": {
                    borderTopLeftRadius: "8px",
                  },
                  "& th:last-child": {
                    borderRight: "0px",
                    borderTopRightRadius: "8px",
                  },
                }}
              >
                <TableCell align="center">
                  <Text2>Offer ID</Text2>
                </TableCell>
                <TableCell>
                  <Text2>Offer Token</Text2>
                </TableCell>
                <TableCell>
                  <Text2>Buyer token</Text2>
                </TableCell>
                <TableCell align="center">
                  <Text2>Rate of Return</Text2>
                </TableCell>
                <TableCell align="center">
                  <Text2>offer Yield</Text2>
                </TableCell>
                <TableCell align="center">
                  <Text2>% Difference</Text2>
                </TableCell>
                <TableCell align="center">
                  <Text2>Official price</Text2>
                </TableCell>
                <TableCell align="center">
                  <Text2>Asked Price</Text2>
                </TableCell>
                <TableCell align="center">
                  <Text2>% Difference</Text2>
                </TableCell>
                <TableCell align="center">
                  <Text2>Stock</Text2>
                </TableCell>
                <TableCell align="center">
                  <Text2>Cart</Text2>
                </TableCell>
                <TableCell align="center">
                  <Text2>View</Text2>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            </TableBody>
          </Table>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;