import * as React from "react";
import { useEffect, useState, Text, StyleSheet, TouchableOpacity } from "react";
import { useAuthContext } from "../../../AuthContext/auth";
import ComCard from "./ComCard";
import { Box } from "@mui/system";
// import { CommForm } from "../CommForm/Commform";
import "./SelComm.css";
import apiClient from "../../../services/apiClient";

export default function ComGrid() {
  const { comm, setComm } = useAuthContext();
  const [communities, setCommunities] = useState([]);

  useEffect(() => {
    async function getComm() {
      const res = await apiClient.listCommBySchool();
      console.log(res);
      setCommunities(res.data.communities);
      console.log("community list", res.data.communities);
    }
    getComm();
  }, []);

  useEffect(() => {
    console.log("communities by school:", communities);
  }, [communities]);

  return (
    <Box
      sx={{
        background: "white",
        width: "80%",

        m: 3,
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "flex-start",
      }}
    >
      {communities.map((comm, index) => {
        return (
          <ComCard key={index} comm={comm} description={false} />
        );
      })}
    </Box>
  );
  return (
    <div className="grid">
      <h1 className="header">Select A Community</h1>
      {community?.map((comm, index) => (
        <ComCard key={index} comm={comm} />
      ))}
    </div>
  );
}
