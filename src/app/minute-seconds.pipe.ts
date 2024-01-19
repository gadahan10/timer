import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'minuteSeconds',
})
export class MinuteSecondsPipe implements PipeTransform {

	transform(value: number): string {
		const minutes: number = Math.floor( value / 60);
		const seconds: number = value % 60;

		return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
	}
}
