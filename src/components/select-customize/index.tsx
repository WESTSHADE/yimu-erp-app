import React, { useState } from "react";
import { Button, Grid, Card } from "@arco-design/web-react";
import { IconMinus } from "@arco-design/web-react/icon";
import { DatePicker } from "@arco-design/mobile-react";
// constant
import { filterValueInit, TIME_SELECTION } from "../../constant/global";
import { pacificTime } from "../../utils/dayjs";
import { getMonthAbbreviation } from "../../utils/format";
// components
import CompareComponent from "./compare";
// utils
import { toast } from "../../utils/tool";
const { Row, Col } = Grid;

interface propType {
    filterValue: GLOBAL.filterType;
    setFilterValue: (_value: GLOBAL.filterType) => void;
    handleConfirm: (_filterValue: GLOBAL.filterType) => void;
    pageType: "prod" | "home" | "orders" | "inventory";
}
const SelectCustomize: React.FC<propType> = (props) => {
    const { filterValue, setFilterValue, handleConfirm, pageType } = props;
    const [picker1Visible, setPicker1Visible] = useState<boolean>(false);
    const [picker2Visible, setPicker2Visible] = useState<boolean>(false);
    const [startTime, setStartTime] = useState<number | undefined>(filterValue?.startTime || undefined);
    const [endTime, setEndTime] = useState<number | undefined>(filterValue?.endTime || undefined);
    const [sortType, setSortType] = useState<string>(filterValue?.sortType || "sold");
    return (
        <Card
            style={{
                marginTop: "16px",
                borderTop: "1px solid #F2F3F5",
            }}
            bordered={false}
        >
            {filterValue.compareType == "single" && (
                <>
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
                            Payment Date
                        </div>
                        {pageType && pageType == "prod" && (
                            <div
                                style={{
                                    color: "#165DFF",
                                    fontWeight: 400,
                                }}
                                onClick={() => setFilterValue({ ...filterValue, compareType: "compare" })}
                            >
                                Compare
                            </div>
                        )}
                    </div>
                    <Row
                        gutter={[8, 0]}
                        style={{
                            marginBottom: 8,
                        }}
                    >
                        {TIME_SELECTION.map((item) => {
                            return (
                                <Col span={8} key={item.key}>
                                    <Button
                                        type="secondary"
                                        style={filterValue.timeSelect == item.key ? { marginRight: 8, backgroundColor: "#E8F3FF", color: "#165DFF", width: "100%" } : { marginRight: 8, width: "100%" }}
                                        onClick={async () => {
                                            setStartTime(item.value[1].valueOf());
                                            setEndTime(item.value[0].valueOf());
                                            setFilterValue({ ...filterValue, timeSelect: item.key });
                                        }}
                                    >
                                        {item.label}
                                    </Button>
                                </Col>
                            );
                        })}
                    </Row>
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
                                    setPicker1Visible(true);
                                }}
                            >
                                {startTime ? pacificTime(startTime).format("MM/DD/YYYY") : "Start Time"}
                            </Button>
                        </Col>
                        <Col span={2}>
                            <IconMinus />
                        </Col>
                        <Col
                            flex="1"
                            onClick={() => {
                                setPicker2Visible(true);
                            }}
                        >
                            <Button
                                style={{
                                    width: "100%",
                                }}
                                onClick={() => {
                                    setPicker2Visible(true);
                                }}
                            >
                                {endTime ? pacificTime(endTime).format("MM/DD/YYYY") : "End Time"}
                            </Button>
                        </Col>
                    </Row>
                </>
            )}
            <DatePicker
                itemStyle={{
                    fontSize: "16px",
                }}
                rangeItemFormat="MM-DD-YYYY"
                className="select-customize"
                visible={picker1Visible}
                maskClosable
                currentTs={startTime || pacificTime().startOf("day").utc().valueOf()}
                mode="date"
                onHide={() => {
                    setPicker1Visible(false);
                }}
                onOk={(timestamp, obj) => {
                    setStartTime(timestamp as number);
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
                currentTs={endTime || pacificTime().startOf("day").utc().valueOf()}
                mode="date"
                onHide={() => {
                    setPicker2Visible(false);
                }}
                onOk={(timestamp, obj) => {
                    setEndTime(timestamp as number);
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
            {pageType && pageType == "prod" && (
                <>
                    {filterValue.compareType == "compare" && <CompareComponent filterValue={filterValue} setFilterValue={setFilterValue} />}
                    <Row
                        style={{
                            marginBottom: 16,
                        }}
                    >
                        <Col>
                            <div
                                style={{
                                    color: "#1D2129",
                                    fontSize: 14,
                                    fontWeight: 500,
                                    marginBottom: 8,
                                }}
                            >
                                Sort
                            </div>
                        </Col>
                        <Col>
                            <Row gutter={[8, 0]}>
                                <Col span={12}>
                                    <Button
                                        style={
                                            sortType == "sold"
                                                ? {
                                                      width: "100%",
                                                      backgroundColor: "#E8F3FF",
                                                      color: "#165DFF",
                                                  }
                                                : { width: "100%" }
                                        }
                                        type="secondary"
                                        onClick={() => {
                                            setSortType("sold");
                                        }}
                                    >
                                        By Items Sold
                                    </Button>
                                </Col>
                                <Col span={12}>
                                    <Button
                                        type="secondary"
                                        style={
                                            sortType == "netSales"
                                                ? {
                                                      width: "100%",
                                                      backgroundColor: "#E8F3FF",
                                                      color: "#165DFF",
                                                  }
                                                : { width: "100%" }
                                        }
                                        onClick={() => {
                                            setSortType("netSales");
                                        }}
                                    >
                                        By Net Sales
                                    </Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </>
            )}
            <Row gutter={[8, 0]}>
                <Col span={12}>
                    <Button
                        style={{
                            width: "100%",
                        }}
                        type="secondary"
                        onClick={() => {
                            setStartTime(undefined);
                            setEndTime(undefined);
                            setSortType("sold");
                            handleConfirm({ ...filterValueInit, startTime: undefined, endTime: undefined, singleTime: pacificTime().valueOf(), timeSelect: "", sortType: "sold" });
                        }}
                    >
                        Reset
                    </Button>
                </Col>
                <Col span={12}>
                    <Button
                        type="primary"
                        style={{
                            width: "100%",
                        }}
                        onClick={() => {
                            if (pageType && pageType == "prod" && filterValue.compareType == "compare" && filterValue.dateRange && filterValue.compareRange) {
                                const { dateRange, compareRange } = filterValue;
                                if (dateRange[0] && dateRange[1] && compareRange[0] && compareRange[1]) {
                                    handleConfirm({ ...filterValue, sortType: sortType });
                                } else {
                                    toast("error", "The time range must be filled in completely");
                                }
                            } else {
                                handleConfirm({ ...filterValue, startTime: startTime, endTime: endTime, sortType: sortType });
                            }
                        }}
                    >
                        Confirm
                    </Button>
                </Col>
            </Row>
        </Card>
    );
};
export default SelectCustomize;
