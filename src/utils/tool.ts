/**
 * 计算两个值的百分比关系
 * @param currentValue
 * @param comparisonValue
 * @returns
 */
export function calculatePercentage(currentValue: number, comparisonValue: number): string {
    if (currentValue === 0 && comparisonValue === 0) {
        return "0";
    } else if (currentValue === comparisonValue) {
        return "0";
    } else if (currentValue === 0 && comparisonValue !== 0) {
        return "100";
    } else if (currentValue !== 0 && comparisonValue === 0) {
        return "100";
    } else {
        // 处理其他情况，例如计算百分比变化,取整
        const percentageChange = Math.abs(((currentValue - comparisonValue) / comparisonValue) * 100);
        return percentageChange.toFixed(2);
    }
}
