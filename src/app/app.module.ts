//Modules
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
//service
import { ApiService, GlobalService, AuthGuard,MaxValidator, MinValidator,ValidationService} from 'service';
                                              //HTTP
/* Feature Modules */
import { ClipboardModule } from 'ngx-clipboard';
import {QRCodeModule} from 'angular2-qrcode';
//component
import { AppComponent } from './app.component';
import { MainPageComponent } from './main_page/main-page.component';
import { HeaderComponent } from './_header/header.component';
import { CustomerService } from './customer_service/customer-service.component';
import { LoginComponent } from './_login/login.component';
import { BetDetailComponent } from './bet_detail/bet-detail.component';
import { BetHistoryComponent } from './bet_history/bet-history.component'
import { BetHistoryDetailComponent } from './bet_history/bet_history_detail/bet-history-detail.component';
import { BulletinBoardComponent } from './bulletin_board/bulletin-board.component';
import { SystemRelatedComponent } from './system_related/system-related.component';
import { RulesComponent, RuleTw, RuleCn, RuleEn } from './system_related/_rules/rules.component';
import { AboutBankCardComponent, AboutDepositSerialComponent, aboutWithdrawComponent} from './system_related/about_bank/about-bank.component';
import { AboutBetComponent } from './system_related/about_bet/about-bet.component';
import { GameTableComponent } from './game_table/game-table.component';
import { GameResultComponent } from './game_result/game-result.component';
import { MemberCenterComponent } from './member_center/member-center.component';
import { UserDataComponent } from './member_center/user_data/user-data.component';
import { DepositDefaultComponent } from './member_center/deposit_default/deposit-default.component';
import { DepositSpeedyPayComponent } from './member_center/deposit_speedy_pay/deposit-speedy-pay.component';
import { DepositPostscriptComponent } from './member_center/deposit_postscript/deposit-postscript.component';
import { DepositSerialComponent } from './member_center/deposit_serial/deposit-serial.component';
import { DepositIchatComponent } from './member_center/deposit_ichat/deposit-ichat.component';
import { DepositOnlineComponent } from './member_center/deposit_online/deposit-online.component';
import { DepositWechatComponent } from './member_center/deposit_wechat/deposit-wechat.component';
import { WithdrawDefaultComponent } from './member_center/withdraw_default/withdraw-default.component';
import { WithdrawSerialComponent } from './member_center/withdraw_serial/withdraw-serial.component';
import { WithdrawIchatComponent } from './member_center/withdraw_ichat/withdraw-ichat.component';
import { RecordComponent } from './member_center/_record/record.component';
import { BankCardComponent } from './member_center/bank_card/bank-card.component';
import { MemberLinkComponent } from './member_center/member_link/member-link.component';
import { IchatAtmComponent } from './member_center/ichat_atm/ichat-atm.component';
import { ProblemComponent } from './member_center/_problem/problem.component';
import { BetDialogComponent } from './game_table/bet_dialog/bet-dialog.component';
import { QrcodeDialogComponent } from './customer_service/qrcode_dialog/qrcode-dialog.component';

import { DiscountComponent } from './discount/discount.component';
import { betRecordComponent } from './member_center/betrecord/betrecord.component';
//directvie

//pipes
import { classifyGameListPipe, getLangPipe, numberToCash, cashAddCommas, SearchFilter ,timetosPipe ,KeysPipe} from './app.pipes';

@NgModule({
	imports: [
		BrowserModule,
		FormsModule,
		ReactiveFormsModule,
		AppRoutingModule,
		ClipboardModule,
		QRCodeModule,
		HttpModule
	],
	declarations: [
		AppComponent,
		MainPageComponent,
		HeaderComponent,
		CustomerService,
		LoginComponent,
		BetDetailComponent,
		BetHistoryComponent,
		BetHistoryDetailComponent,
		BulletinBoardComponent,
		SystemRelatedComponent,
		RulesComponent,
		RuleTw,
		RuleCn,
		RuleEn,
		ProblemComponent,
		AboutBankCardComponent,
		AboutDepositSerialComponent,
		aboutWithdrawComponent,
		AboutBetComponent,
		GameTableComponent,
		GameResultComponent,
		MemberCenterComponent,
		UserDataComponent,
		MemberLinkComponent,
		IchatAtmComponent,
		MaxValidator,
		MinValidator,
		DepositDefaultComponent,
		DepositSpeedyPayComponent,
		DepositPostscriptComponent,
		DepositSerialComponent,
		DepositIchatComponent,
		DepositOnlineComponent,
		DepositWechatComponent,
		WithdrawDefaultComponent,
		WithdrawSerialComponent,
		WithdrawIchatComponent,
		BankCardComponent,
		RecordComponent,
		classifyGameListPipe,
		getLangPipe,
		numberToCash,
		cashAddCommas,
		SearchFilter,
		BetDialogComponent,
		QrcodeDialogComponent,
		DiscountComponent,
		timetosPipe,
		betRecordComponent,
		KeysPipe
	],
	providers: [
		ApiService,
		GlobalService,
		AuthGuard,
		ValidationService,
		getLangPipe
	],
	bootstrap: [ AppComponent ]
})
export class AppModule { }
