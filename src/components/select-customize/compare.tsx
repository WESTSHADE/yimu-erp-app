import React, { useState } from "react";
import { Button, Grid, Card } from "@arco-design/web-react";
import { IconMinus } from "@arco-design/web-react/icon";
import { DatePicker } from "@arco-design/mobile-react";
// constant
import { pacificTime } from "../../utils/dayjs";
import { getMonthAbbreviation } from "../../utils/format";
const { Row, Col } = Grid;

interface propType {
    filterValue: GLOBAL.filterType;
    setFilterValue: (_value: GLOBAL.filterType) => void;
}
const CompareComponent: React.FC<propType> = (props) => {
    const { filterValue, setFilterValue } = props;
    const [picker1Visible, setPicker1Visible] = useState<boolean>(false);
    const [picker2Visible, setPicker2Visible] = useState<boolean>(false);
    const [picker3Visible, setPicker3Visible] = useState<boolean>(false);
    const [picker4Visible, setPicker4Visible] = useState<boolean>(false);
    return (
        <Card
            style={{
                padding: 0,
                border: "none",
            }}
            bodyStyle={{
                padding: 0,
            }}
            bordered={false}
        >
            <div
                style={{
                    fontSize: 14,
                    marginBottom: 12,
                    display: "flex",
                    justifyContent: "space-between",
                }}
            >
                <div
                    style={{
                        color: "#1D2129",
                        fontWeight: 500,
                    }}
                >
                    Date Comparison
                </div>
                <div
                    style={{
                        color: "#165DFF",
                        fontWeight: 400,
                    }}
                    onClick={() => setFilterValue({ ...filterValue, compareType: "single" })}
                >
                    Back
                </div>
            </div>
            <DatePicker
                itemStyle={{
                    fontSize: "16px",
                }}
                rangeItemFormat="MM-DD-YYYY"
                className="select-customize"
                visible={picker1Visible}
                maskClosable
                currentTs={filterValue?.dateRange?.[0] || pacificTime().startOf("day").utc().valueOf()}
                mode="date"
                onHide={() => {
                    setPicker1Visible(false);
                }}
                onOk={(timestamp, obj) => {
                    setFilterValue({ ...filterValue, dateRange: [timestamp as number, filterValue?.dateRange?.[1] || undefined] });
                }}
                formatter={(value, type) => {
                    if (type === "year") {
                        return `${value}`;
                    } else if (type === "month") {
                        return `${getMonthAbbreviation(value)}`;
                    } else if (type === "date") {
                        return `${value}th`;
                    } else return "";
                }}
            />
            <DatePicker
                className="select-customize"
                visible={picker2Visible}
                maskClosable
                disabled={false}
                currentTs={filterValue?.dateRange?.[1] || pacificTime().startOf("day").utc().valueOf()}
                mode="date"
                onHide={() => {
                    setPicker2Visible(false);
                }}
                onOk={(timestamp, obj) => {
                    setFilterValue({ ...filterValue, dateRange: [filterValue?.dateRange?.[0] || undefined, timestamp as number] });
                }}
                formatter={(value, type) => {
                    if (type === "year") {
                        return `${value}`;
                    } else if (type === "month") {
                        return `${getMonthAbbreviation(value)}`;
                    } else if (type === "date") {
                        return `${value}th`;
                    } else return "";
                }}
            />
            <DatePicker
                itemStyle={{
                    fontSize: "16px",
                }}
                rangeItemFormat="MM-DD-YYYY"
                className="select-customize"
                visible={picker3Visible}
                maskClosable
                currentTs={filterValue?.compareRange?.[0] || pacificTime().startOf("day").utc().valueOf()}
                mode="date"
                onHide={() => {
                    setPicker3Visible(false);
                }}
                onOk={(timestamp, obj) => {
                    setFilterValue({ ...filterValue, compareRange: [timestamp as number, filterValue?.compareRange?.[1] || undefined] });
                }}
                formatter={(value, type) => {
                    if (type === "year") {
                        return `${value}`;
                    } else if (type === "month") {
                        return `${getMonthAbbreviation(value)}`;
                    } else if (type === "date") {
                        return `${value}th`;
                    } else return "";
                }}
            />
            <DatePicker
                className="select-customize"
                visible={picker4Visible}
                maskClosable
                disabled={false}
                currentTs={filterValue?.compareRange?.[1] || pacificTime().startOf("day").utc().valueOf()}
                mode="date"
                onHide={() => {
                    setPicker4Visible(false);
                }}
                onOk={(timestamp, obj) => {
                    setFilterValue({ ...filterValue, compareRange: [filterValue?.compareRange?.[0] || undefined, timestamp as number] });
                }}
                formatter={(value, type) => {
                    if (type === "year") {
                        return `${value}`;
                    } else if (type === "month") {
                        return `${getMonthAbbreviation(value)}`;
                    } else if (type === "date") {
                        return `${value}th`;
                    } else return "";
                }}
            />
            <div
                style={{
                    color: "#86909C",
                    marginBottom: 8,
                }}
            >
                Date1
            </div>
            <Row
                gutter={[8, 0]}
                align="center"
                style={{
                    flexWrap: "nowrap",
                    height: 32,
                    marginBottom: 12,
                }}
                justify="center"
            >
                <Col flex="1">
                    <Button
                        style={{
                            width: "100%",
                        }}
                        onClick={() => {
                            setPicker1Visible(true);
                        }}
                    >
                        {filterValue?.dateRange?.[0] ? pacificTime(filterValue?.dateRange?.[0]).format("MM/DD/YYYY") : "Start Time"}
                    </Button>
                </Col>
                <Col span={2}>
                    <IconMinus />
                </Col>
                <Col flex="1">
                    <Button
                        style={{
                            width: "100%",
                        }}
                        onClick={() => {
                            setPicker2Visible(true);
                        }}
                    >
                        {filterValue?.dateRange?.[1] ? pacificTime(filterValue?.dateRange?.[1]).format("MM/DD/YYYY") : "End Time"}
                    </Button>
                </Col>
            </Row>
            <div
                style={{
                    color: "#86909C",
                    marginBottom: 8,
                }}
            >
                Date1
            </div>
            <Row
                gutter={[8, 0]}
                align="center"
                style={{
                    flexWrap: "nowrap",
                    height: 32,
                    marginBottom: 16,
                }}
                justify="center"
            >
                <Col flex="1">
                    <Button
                        style={{
                            width: "100%",
                        }}
                        onClick={() => {
                            setPicker3Visible(true);
                        }}
                    >
                        {filterValue?.compareRange?.[0] ? pacificTime(filterValue?.compareRange?.[0]).format("MM/DD/YYYY") : "Start Time"}
                    </Button>
                </Col>
                <Col span={2}>
                    <IconMinus />
                </Col>
                <Col flex="1">
                    <Button
                        style={{
                            width: "100%",
                        }}
                        onClick={() => {
                            setPicker4Visible(true);
                        }}
                    >
                        {filterValue?.compareRange?.[1] ? pacificTime(filterValue?.compareRange?.[1]).format("MM/DD/YYYY") : "End Time"}
                    </Button>
                </Col>
            </Row>
        </Card>
    );
};
export default CompareComponent;
