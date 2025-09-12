import React, { useState, useEffect } from "react";
import { Input, Button, Grid, Card } from "@arco-design/web-react";
import { IconMinus } from "@arco-design/web-react/icon";
import { DatePicker } from "@arco-design/mobile-react";
// constant
import { filterValueInit, TIME_SELECTION } from "../../constant/global";
import { pacificTime } from "../../utils/dayjs";
const { Row, Col } = Grid;

interface propType {
    filterValue: GLOBAL.filterType;
    setFilterValue: (_value: GLOBAL.filterType) => void;
    handleConfirm: (_filterValue: GLOBAL.filterType) => void;
}
const SelectCustomize: React.FC<propType> = (props) => {
    const { filterValue, setFilterValue, handleConfirm } = props;
    const [picker1Visible, setPicker1Visible] = useState<boolean>(false);
    const [picker2Visible, setPicker2Visible] = useState<boolean>(false);
    const [startTime, setStartTime] = useState<number | undefined>(filterValue?.startTime || undefined);
    const [endTime, setEndTime] = useState<number | undefined>(filterValue?.endTime || undefined);

    return (
        <Card
            style={{
                marginTop: "16px",
                borderTop: "1px solid #F2F3F5",
            }}
            bordered={false}
        >
            <div
                style={{
                    color: "#1D2129",
                    fontSize: 14,
                    fontWeight: 500,
                    marginBottom: 8,
                }}
            >
                Payment Date
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
            <DatePicker
                rangeItemFormat="MM-DD-YYYY"
                className="select-customize"
                visible={picker1Visible}
                maskClosable
                currentTs={startTime}
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
                        return `${value}月`;
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
                currentTs={endTime}
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
                        return `${value}月`;
                    } else if (type === "date") {
                        return `${value}th`;
                    } else return "";
                }}
            />
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
                    <Input
                        value={startTime ? pacificTime(startTime).format("MM/DD/YYYY") : undefined}
                        placeholder="Start Time"
                        onClick={() => {
                            setPicker1Visible(true);
                        }}
                    />
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
                    <Input
                        placeholder="End Time"
                        value={endTime ? pacificTime(endTime).format("MM/DD/YYYY") : undefined}
                        onClick={() => {
                            setPicker2Visible(true);
                        }}
                    />
                </Col>
            </Row>
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
                            handleConfirm({ ...filterValueInit, startTime: undefined, endTime: undefined, singleTime: pacificTime().valueOf(), timeSelect: "" });
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
                            handleConfirm({ ...filterValue, startTime: startTime, endTime: endTime });
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
