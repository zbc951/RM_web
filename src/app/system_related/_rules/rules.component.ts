import { Component } from '@angular/core';
import { GlobalService } from 'service';

@Component({
    selector: 'rules',
    templateUrl: 'rules.component.html'
})
/**
 * 規則說明 
 */
export class RulesComponent {
     constructor(public globals: GlobalService) { 
    }
}

/**
 * 繁體中文 規則說明
 */
@Component({
    selector: 'rule-tw',
    templateUrl: 'rule-tw.html'
})

export class RuleTw {
    public selectItem : string = "about_rule_pd";
}

/**
 * 簡體中文 規則說明
 */
@Component({
    selector: 'rule-cn',
    templateUrl: 'rule-cn.html'
})
export class RuleCn {
    public selectItem : string = "about_rule_pd";
}

/**
 * 英文 規則說明
 */
@Component({
    selector: 'rule-en',
    templateUrl: 'rule-en.html'
})
export class RuleEn {
    public selectItem : string = "about_rule_pd";
}